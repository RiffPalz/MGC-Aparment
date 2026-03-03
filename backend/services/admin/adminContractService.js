import { sequelize } from "../../config/database.js";
import { Op } from "sequelize";
import Unit from "../../models/unit.js";
import Contract from "../../models/contract.js";
import ContractTenant from "../../models/contractTenant.js";
import User from "../../models/user.js";

export const createContractByAdmin = async ({
    unit_id,
    start_date,
    end_date,
    status,
    tenancy_rules,
    termination_renewal_conditions,
    tenantIds,
    contract_file,
}) => {
    const transaction = await sequelize.transaction();

    try {
        /* =========================
           Validate Unit
        ========================= */

        const unit = await Unit.findByPk(unit_id, { transaction });

        if (!unit) throw new Error("Unit not found.");
        if (!unit.is_active) throw new Error("Unit is not active.");

        /* =========================
           Validate Dates
        ========================= */

        if (new Date(end_date) <= new Date(start_date)) {
            throw new Error("End date must be after start date.");
        }

        /* =========================
            Validate Tenant Count
        ========================= */

        if (!tenantIds || tenantIds.length === 0) {
            throw new Error("At least one tenant is required.");
        }

        if (tenantIds.length > unit.max_capacity) {
            throw new Error(`Maximum ${unit.max_capacity} tenants allowed.`);
        }

        /* =========================
          Prevent Tenant With Active Contract
        ========================= */

        const existingActive = await Contract.findOne({
            include: {
                model: User,
                as: "tenants",
                where: { ID: { [Op.in]: tenantIds } },
            },
            where: { status: "Active" },
            transaction,
        });

        if (existingActive) {
            throw new Error("One of the tenants already has an active contract.");
        }

        /* =========================
          Prevent Multiple Active Contract Per Unit
        ========================= */

        if (status === "Active") {
            const unitActive = await Contract.findOne({
                where: {
                    unit_id,
                    status: "Active",
                },
                transaction,
            });

            if (unitActive) {
                throw new Error("Unit already has an active contract.");
            }
        }

        /* =========================
           Create Contract
        ========================= */

        const contract = await Contract.create(
            {
                unit_id,
                start_date,
                end_date,
                status,
                tenancy_rules,
                termination_renewal_conditions,
                contract_file,
            },
            { transaction }
        );

        /* =========================
          Attach Tenants
        ========================= */

        for (const userId of tenantIds) {
            await ContractTenant.create(
                {
                    contract_id: contract.ID,
                    user_id: userId,
                },
                { transaction }
            );

            // Update user unitNumber if contract is Active
            if (status === "Active") {
                await User.update(
                    { unitNumber: unit.unit_number },
                    { where: { ID: userId }, transaction }
                );
            }
        }

        await transaction.commit();
        return contract;

    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

export const terminateContract = async (contractId) => {
    const transaction = await sequelize.transaction();

    try {
        const contract = await Contract.findByPk(contractId, {
            include: {
                model: User,
                as: "tenants",
            },
            transaction,
        });

        if (!contract) throw new Error("Contract not found.");
        if (contract.status !== "Active")
            throw new Error("Only active contracts can be terminated.");

        await contract.update(
            { status: "Terminated" },
            { transaction }
        );

        // Clear tenant unitNumber
        for (const tenant of contract.tenants) {
            await tenant.update(
                { unitNumber: null },
                { transaction }
            );
        }

        await transaction.commit();
        return contract;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

export const renewContract = async ({
    oldContractId,
    newStartDate,
    newEndDate,
    contract_file,
}) => {
    const transaction = await sequelize.transaction();

    try {
        const oldContract = await Contract.findByPk(oldContractId, {
            include: {
                model: User,
                as: "tenants",
            },
            transaction,
        });

        if (!oldContract) throw new Error("Old contract not found.");

        if (oldContract.status === "Active")
            throw new Error("Terminate current contract before renewal.");

        const newContract = await Contract.create(
            {
                unit_id: oldContract.unit_id,
                start_date: newStartDate,
                end_date: newEndDate,
                status: "Active",
                tenancy_rules: oldContract.tenancy_rules,
                termination_renewal_conditions:
                    oldContract.termination_renewal_conditions,
                contract_file,
            },
            { transaction }
        );

        for (const tenant of oldContract.tenants) {
            await ContractTenant.create(
                {
                    contract_id: newContract.ID,
                    user_id: tenant.ID,
                },
                { transaction }
            );

            await tenant.update(
                { unitNumber: oldContract.unit.unit_number },
                { transaction }
            );
        }

        await transaction.commit();
        return newContract;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

export const editContract = async (contractId, updates) => {
    const contract = await Contract.findByPk(contractId);

    if (!contract) throw new Error("Contract not found.");

    await contract.update(updates);
    return contract;
};

export const getAdminDashboardData = async () => {
    /* ============================
       Get All Units With Active Contract
    ============================ */
    const units = await Unit.findAll({
        include: [
            {
                model: Contract,
                as: "contracts",
                where: { status: "Active" },
                required: false,
                include: [
                    {
                        model: User,
                        as: "tenants",
                        attributes: ["ID", "fullName", "emailAddress"],
                    },
                ],
            },
        ],
        order: [["unit_number", "ASC"]],
    });

    const formattedUnits = units.map((unit) => ({
        ID: unit.ID,
        unit_number: unit.unit_number,
        floor: unit.floor,
        max_capacity: unit.max_capacity,
        status: unit.contracts.length > 0 ? "Occupied" : "Vacant",
        contract: unit.contracts[0] || null,
    }));

    /* ============================
        Get All Contracts With Tenants
    ============================ */
    const contracts = await Contract.findAll({
        include: [
            {
                model: Unit,
                as: "unit",
                attributes: ["ID", "unit_number"],
            },
            {
                model: User,
                as: "tenants",
                attributes: ["ID", "fullName", "emailAddress"],
            },
        ],
        order: [["created_at", "DESC"]],
    });

    const formattedContracts = contracts.map((contract) => ({
        ID: contract.ID,
        unit_number: contract.unit.unit_number,
        start_date: contract.start_date,
        end_date: contract.end_date,
        status: contract.status,
        tenants: contract.tenants,
    }));

    return {
        units: formattedUnits,
        contracts: formattedContracts,
    };
};

export const getExpiringContracts = async () => {
  const today = new Date();

  const next30Days = new Date();
  next30Days.setDate(today.getDate() + 30);

  // Convert to YYYY-MM-DD for DATEONLY comparison
  const todayStr = today.toISOString().split("T")[0];
  const nextDateStr = next30Days.toISOString().split("T")[0];

  const contracts = await Contract.findAll({
    where: {
      status: "Active",
      end_date: {
        [Op.between]: [todayStr, nextDateStr],
      },
    },
    include: [
      {
        model: Unit,
        as: "unit",
        attributes: ["unit_number", "floor"],
      },
      {
        model: User,
        as: "tenants",
        attributes: ["ID", "fullName", "emailAddress"],
      },
    ],
    order: [["end_date", "ASC"]],
  });

  // Add daysRemaining
  const contractsWithDays = contracts.map((contract) => {
    const endDate = new Date(contract.end_date);
    const diffTime = endDate - today;
    const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return {
      ...contract.toJSON(),
      daysRemaining,
    };
  });

  return contractsWithDays;
};

export const completeContract = async (contractId) => {
  const transaction = await sequelize.transaction();

  try {
    const contract = await Contract.findByPk(contractId, {
      include: {
        model: User,
        as: "tenants",
      },
      transaction,
    });

    if (!contract) throw new Error("Contract not found.");

    if (contract.status !== "Active")
      throw new Error("Only active contracts can be completed.");

    await contract.update(
      { status: "Completed" },
      { transaction }
    );

    // Clear tenant unitNumber
    for (const tenant of contract.tenants) {
      await tenant.update(
        { unitNumber: null },
        { transaction }
      );
    }

    await transaction.commit();
    return contract;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};