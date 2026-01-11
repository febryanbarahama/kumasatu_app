import express from "express";
import upload from "../middlewares/uploadCloudinary.js";
import protect from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post(
  "/image",
  protect, // optional tapi sangat disarankan
  upload.single("image"),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({
        message: "Tidak ada file yang diupload",
      });
    }

    return res.status(200).json({
      message: "Upload berhasil",
      url: req.file.path, // URL Cloudinary
      public_id: req.file.filename,
    });
  }
);

export default router;
