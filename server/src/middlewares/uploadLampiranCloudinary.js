// middleware/uploadLampiranCloudinary.js
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "administrasi/lampiran",
    resource_type: "raw", // 🔥 WAJIB
  },
});

const uploadLampiran = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

export default uploadLampiran;
