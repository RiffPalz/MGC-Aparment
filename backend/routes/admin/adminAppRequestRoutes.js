import express from "express";
import adminAuth from "../../middleware/adminAuth.js";

import {
  getAllApplicationRequestsController,
  deleteApplicationRequestController,
  getApplicationRequestStatsController
} from "../../controllers/admin/adminAppRequestController.js";

const router = express.Router();


/* GET APPLICATION REQUEST STATS */
router.get(
  "/stats",
  adminAuth,
  getApplicationRequestStatsController
);


/* GET ALL APPLICATION REQUESTS */
router.get(
  "/",
  adminAuth,
  getAllApplicationRequestsController
);


/* DELETE APPLICATION REQUEST */
router.delete(
  "/:id",
  adminAuth,
  deleteApplicationRequestController
);


export default router;