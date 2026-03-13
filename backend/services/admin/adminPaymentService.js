import { sequelize } from "../../config/database.js";
import Payment from "../../models/payment.js";
import Contract from "../../models/contract.js";
import Unit from "../../models/unit.js";
import User from "../../models/user.js";

// Create a new payment record
export const createPayment = async ({
    contract_id,
    category,
    billing_month,
    amount,
    due_date,
}) => {

    // Check contract
    const contract = await Contract.findByPk(contract_id);

    if (!contract) {
        throw new Error("Contract not found");
    }

    // Check due date
    const today = new Date();
    today.setHours(0,0,0,0);

    const dueDate = new Date(due_date);
    dueDate.setHours(0,0,0,0);

    if (dueDate < today) {
        throw new Error("That date is already past.");
    }

    // Prevent duplicate bill
    const existing = await Payment.findOne({
        where: {
            contract_id,
            category,
            billing_month
        }
    });

    if (existing) {
        throw new Error("Payment for this month already exists.");
    }

    // Create payment
    const payment = await Payment.create({
        contract_id,
        category,
        billing_month,
        amount,
        due_date,
    });

    return payment;
};

// Fetch all payments with related contract, unit, and tenant info
export const getAllPayments = async () => {
    const payments = await Payment.findAll({
        include: [
            {
                model: Contract,
                as: "contract",
                attributes: ["ID", "start_date", "end_date"],
                include: [
                    {
                        model: Unit,
                        as: "unit",
                        attributes: ["unit_number", "floor"],
                    },
                    {
                        model: User,
                        as: "tenants",
                        attributes: ["ID", "fullName", "publicUserID"],
                        through: { attributes: [] },
                    },
                ],
            },
        ],
        order: [["created_at", "DESC"]],
    });

    return payments;
};

// Fetch all payments belonging to a specific contract
export const getPaymentsByContract = async (contractId) => {
    const payments = await Payment.findAll({
        where: { contract_id: contractId },
        order: [["billing_month", "DESC"]],
    });

    return payments;
};

// Update a payment status to "Paid"
export const verifyPayment = async (paymentId) => {

    const payment = await Payment.findByPk(paymentId);

    // Check if payment exists
    if (!payment) {
        throw new Error("Payment not found");
    }

    // Check status
    if (payment.status !== "Pending Verification") {
        throw new Error("Payment is not awaiting verification");
    }

    // Approve payment
    payment.status = "Paid";

    await payment.save();

    return payment;
};

// Get a total of all costs per unit for a specific month
export const getMonthlySummary = async (billingMonth) => {
    const summary = await Payment.findAll({
        attributes: [
            [sequelize.col("contract.unit.unit_number"), "unit_number"],
            "billing_month",
            [sequelize.fn("SUM", sequelize.col("amount")), "totalAmount"]
        ],
        include: [
            {
                model: Contract,
                as: "contract",
                attributes: [],
                include: [
                    {
                        model: Unit,
                        as: "unit",
                        attributes: []
                    }
                ]
            }
        ],
        where: {
            billing_month: billingMonth
        },
        group: [
            "contract.unit.unit_number",
            "billing_month"
        ],
        order: [
            [sequelize.col("contract.unit.unit_number"), "ASC"]
        ]
    });

    return summary;
};

/* GET PAYMENT DASHBOARD */
export const getPaymentDashboard = async () => {

    // Total collected
    const totalCollected = await Payment.sum("amount", {
        where: { status: "Paid" }
    });

    // Pending verification
    const pendingVerification = await Payment.count({
        where: { status: "Pending Verification" }
    });

    // Overdue payments
    const overduePayments = await Payment.count({
        where: { status: "Overdue" }
    });

    // Unpaid bills
    const unpaidBills = await Payment.count({
        where: { status: "Unpaid" }
    });

    // Monthly revenue
    const monthlyRevenue = await Payment.findAll({
        attributes: [
            "billing_month",
            [sequelize.fn("SUM", sequelize.col("amount")), "total"]
        ],
        where: { status: "Paid" },
        group: ["billing_month"],
        order: [["billing_month", "ASC"]]
    });

    return {
        totalCollected: totalCollected || 0,
        pendingVerification,
        overduePayments,
        unpaidBills,
        monthlyRevenue
    };
};