// middleware/uploadLampiranCloudinary.js
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinaryClient";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "administrasi/lampiran",
    resource_type: "raw",
  },
});

const uploadLampiran = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
});

export default uploadLampiran;
