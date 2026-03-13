import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {

    const today = new Date();
    const date =
      today.getFullYear() +
      "-" +
      String(today.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(today.getDate()).padStart(2, "0");

    const tenantId = req.auth.id; // logged in tenant

    return {
      folder: `MGC-Building/receipts/tenant_${tenantId}`,
      allowed_formats: ["jpg", "jpeg", "png"],

      public_id: `receipt_${date}_${Date.now()}`
    };
  }
});

const uploadReceipt = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});

export default uploadReceipt;