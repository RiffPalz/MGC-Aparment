import express from "express";
import adminAuth from "../../middleware/adminAuth.js";

import {
  createPaymentAdmin,
  getAllPaymentsAdmin,
  getPaymentsByContractAdmin,
  verifyPaymentAdmin,
  getMonthlySummaryAdmin,
  getPaymentDashboardAdmin,
  updatePaymentAdmin,
  deletePaymentAdmin,
} from "../../controllers/admin/adminPaymentController.js";

const router = express.Router();

/* CREATE PAYMENT */
router.post(
  "/",
  adminAuth,
  createPaymentAdmin
);

/* GET ALL PAYMENTS */
router.get(
  "/",
  adminAuth,
  getAllPaymentsAdmin
);

/* GET PAYMENTS BY CONTRACT */
router.get(
  "/contract/:id",
  adminAuth,
  getPaymentsByContractAdmin
);

/* VERIFY PAYMENT */
router.patch("/:id/verify", adminAuth, verifyPaymentAdmin);

/* UPDATE PAYMENT */
router.patch("/:id", adminAuth, updatePaymentAdmin);

/* DELETE PAYMENT */
router.delete("/:id", adminAuth, deletePaymentAdmin);

/* GET MONTHLY SUMMARY */
router.get(
  "/summary",
  adminAuth,
  getMonthlySummaryAdmin
);

/* GET PAYMENT DASHBOARD */
router.get(
  "/dashboard",
  adminAuth,
  getPaymentDashboardAdmin
);

export default router;