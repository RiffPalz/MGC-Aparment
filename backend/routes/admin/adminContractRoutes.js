import express from "express";
import uploadContract from "../../middleware/uploadContract.js";
import adminAuth from "../../middleware/adminAuth.js";

import {
   createContractAdmin,
   terminateContractAdmin,
   renewContractAdmin,
   editContractAdmin,
   getAdminDashboard,
   getExpiringContractsAdmin,
   completeContractAdmin
} from "../../controllers/admin/adminContractController.js";

const router = express.Router();

/* ==============================
   CREATE CONTRACT
============================== */
router.post(
   "/",
   adminAuth,
   uploadContract.single("contractFile"),
   createContractAdmin
);

/* ==============================
   EDIT CONTRACT
============================== */
router.put(
   "/:id",
   adminAuth,
   uploadContract.single("contractFile"),
   editContractAdmin
);

/* ==============================
   TERMINATE CONTRACT
============================== */
router.put(
   "/:id/terminate",
   adminAuth,
   terminateContractAdmin
);

/* ==============================
   RENEW CONTRACT
============================== */
router.post(
   "/:id/renew",
   adminAuth,
   uploadContract.single("contractFile"),
   renewContractAdmin
);


/* ==============================
   GET ALL CONTRACT w/ status 
============================== */
router.get("/dashboard", adminAuth, getAdminDashboard);

router.get(
   "/expiring",
   adminAuth,
   getExpiringContractsAdmin
);

router.put(
  "/:id/complete",
  adminAuth,
  completeContractAdmin
);

export default router;