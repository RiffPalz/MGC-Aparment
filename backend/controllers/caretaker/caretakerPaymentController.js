import {
    getAllPayments,
    getPendingPayments,
    verifyPayment
} from "../../services/caretaker/caretakerPaymentService.js";


/*  GET ALL PAYMENTS */
export const getAllPaymentsController = async (req, res) => {
    try {

        const payments = await getAllPayments();

        return res.status(200).json({
            success: true,
            count: payments.length,
            payments
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch payments"
        });

    }
};



/*   GET PAYMENTS PENDING VERIFICATION */
export const getPendingPaymentsController = async (req, res) => {
    try {

        const payments = await getPendingPayments();

        return res.status(200).json({
            success: true,
            count: payments.length,
            payments
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch pending payments"
        });

    }
};



/*   VERIFY PAYMENT */
export const verifyPaymentController = async (req, res) => {
    try {

        const { id } = req.params;

        const payment = await verifyPayment(id);

        return res.status(200).json({
            success: true,
            message: "Payment verified successfully",
            payment
        });

    } catch (error) {

        return res.status(400).json({
            success: false,
            message: error.message
        });

    }
};