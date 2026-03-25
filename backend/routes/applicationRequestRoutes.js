import express from "express";
import { submitApplicationRequestController, checkApplicationStatusController } from "../controllers/applicationRequestController.js";
import uploadApplicationID from "../middleware/uploadApplicationID.js";

const router = express.Router();

/* SUBMIT APPLICATION REQUEST */
router.post(
  "/",
  uploadApplicationID.single("validID"),
  submitApplicationRequestController
);

/* CHECK APPLICATION STATUS BY EMAIL */
router.get("/status", checkApplicationStatusController);

export default router;