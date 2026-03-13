import express from "express";
import adminAuth from "../../middleware/adminAuth.js";

import {
  createPaymentAdmin,
  getAllPaymentsAdmin,
  getPaymentsByContractAdmin,
  verifyPaymentAdmin,
  getMonthlySummaryAdmin,
  getPaymentDashboardAdmin
} from "../../controllers/admin/adminPaymentController.js";

const router = express.Router();

router.post("/", adminAuth, createPaymentAdmin);

router.get("/", adminAuth, getAllPaymentsAdmin);

router.get("/contract/:id", adminAuth, getPaymentsByContractAdmin);

router.patch("/:id/verify", adminAuth, verifyPaymentAdmin);

router.get("/summary", adminAuth, getMonthlySummaryAdmin);

router.get("/dashboard", adminAuth, getPaymentDashboardAdmin);


export default router;