import express from "express";
import { submitApplicationRequestController } from "../controllers/applicationRequestController.js";
import uploadApplicationID from "../middleware/uploadApplicationID.js";

const router = express.Router();


/* SUBMIT APPLICATION REQUEST */
router.post(
  "/",
  uploadApplicationID.single("validID"),
  submitApplicationRequestController
);


export default router;