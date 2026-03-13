import express from "express";
import caretakerAuth from "../../middleware/caretakerAuth.js";

import {
    getAllPaymentsController,
    getPendingPaymentsController,
    verifyPaymentController
} from "../../controllers/caretaker/caretakerPaymentController.js";

const router = express.Router();


/* GET ALL PAYMENTS */
router.get(
    "/",
    caretakerAuth,
    getAllPaymentsController
);


/* GET PAYMENTS PENDING VERIFICATION */
router.get(
    "/pending",
    caretakerAuth,
    getPendingPaymentsController
);


/*   VERIFY PAYMENT */
router.patch(
    "/:id/verify",
    caretakerAuth,
    verifyPaymentController
);


export default router;