import {
    createContractByAdmin,
    terminateContract,
    renewContract,
    editContract,
    getAdminDashboardData,
    getExpiringContracts,
    completeContract
} from "../../services/admin/adminContractService.js";

/* ==============================
   CREATE CONTRACT
============================== */
export const createContractAdmin = async (req, res) => {
    try {
        const {
            unit_id,
            start_date,
            end_date,
            status,
            tenancy_rules,
            termination_renewal_conditions,
            tenantIds,
        } = req.body;

        const contract_file = req.file ? req.file.path : null;

        const contract = await createContractByAdmin({
            unit_id,
            start_date,
            end_date,
            status,
            tenancy_rules,
            termination_renewal_conditions,
            tenantIds: JSON.parse(tenantIds),
            contract_file,
        });

        return res.status(201).json({
            message: "Contract created successfully.",
            contract,
        });
    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
};

/* ==============================
   TERMINATE CONTRACT
============================== */
export const terminateContractAdmin = async (req, res) => {
    try {
        const { id } = req.params;

        const contract = await terminateContract(id);

        return res.status(200).json({
            message: "Contract terminated successfully.",
            contract,
        });
    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
};

/* ==============================
   RENEW CONTRACT
============================== */
export const renewContractAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const { newStartDate, newEndDate } = req.body;

        const contract_file = req.file ? req.file.path : null;

        const newContract = await renewContract({
            oldContractId: id,
            newStartDate,
            newEndDate,
            contract_file,
        });

        return res.status(201).json({
            message: "Contract renewed successfully.",
            contract: newContract,
        });
    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
};

/* ==============================
   EDIT CONTRACT
============================== */
export const editContractAdmin = async (req, res) => {
    try {
        const { id } = req.params;

        const updates = { ...req.body };

        // If new PDF uploaded
        if (req.file) {
            updates.contract_file = req.file.path;
        }

        const updatedContract = await editContract(id, updates);

        return res.status(200).json({
            message: "Contract updated successfully.",
            contract: updatedContract,
        });
    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
};

/* ==============================
   ADMIN DASHBOARD DATA
============================== */
export const getAdminDashboard = async (req, res) => {
    try {
        const data = await getAdminDashboardData();
        // service already returns { units, contracts }
        return res.status(200).json({ success: true, ...data });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

/* ==============================
   ADMIN EXPIRING DATA
============================== */
export const getExpiringContractsAdmin = async (req, res) => {
    try {
        const contracts = await getExpiringContracts();

        return res.status(200).json({
            success: true,
            count: contracts.length,
            contracts,
        });
    } catch (error) {
        console.error("Expiring contract error:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const completeContractAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const contract = await completeContract(id);

    return res.status(200).json({
      message: "Contract completed successfully.",
      contract,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};