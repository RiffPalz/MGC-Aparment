import Payment from "../../models/payment.js";
import Contract from "../../models/contract.js";
import Unit from "../../models/unit.js";
import User from "../../models/user.js";

/* GET ALL PAYMENTS  */
export const getAllPayments = async () => {

    const payments = await Payment.findAll({
        include: [
            {
                model: Contract,
                as: "contract",
                attributes: ["ID"],
                include: [
                    {
                        model: Unit,
                        as: "unit",
                        attributes: ["unit_number", "floor"]
                    },
                    {
                        model: User,
                        as: "tenants",
                        attributes: ["ID", "fullName", "publicUserID"],
                        through: { attributes: [] }
                    }
                ]
            }
        ],
        order: [["created_at", "DESC"]]
    });

    return payments;
};



/* GET PAYMENTS PENDING VERIFICATION */
export const getPendingPayments = async () => {

    const payments = await Payment.findAll({
        where: {
            status: "Pending Verification"
        },
        include: [
            {
                model: Contract,
                as: "contract",
                include: [
                    {
                        model: Unit,
                        as: "unit",
                        attributes: ["unit_number"]
                    },
                    {
                        model: User,
                        as: "tenants",
                        attributes: ["ID", "fullName"],
                        through: { attributes: [] }
                    }
                ]
            }
        ],
        order: [["created_at", "DESC"]]
    });

    return payments;
};



/*  VERIFY PAYMENT  */
export const verifyPayment = async (paymentId) => {

    const payment = await Payment.findByPk(paymentId);

    if (!payment) {
        throw new Error("Payment not found");
    }

    if (payment.status !== "Pending Verification") {
        throw new Error("Payment is not awaiting verification");
    }

    payment.status = "Paid";

    await payment.save();

    return payment;
};