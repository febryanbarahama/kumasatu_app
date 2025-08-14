import express from "express";
import multer from "multer";
import path from "path";
import {
  getAllKeluarga,
  getKeluargaByNoKK,
  createKeluarga,
  updateKeluarga,
  deleteKeluarga,
  importKeluarga,
} from "../controllers/keluargaController.js";
import protect from "../middlewares/authMiddleware.js";

const router = express.Router();

// ===================== MULTER CONFIG =====================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Folder penyimpanan sementara
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Nama unik
  },
});

// Filter hanya untuk file Excel
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
    file.mimetype === "application/vnd.ms-excel"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Hanya file Excel yang diizinkan"), false);
  }
};

// Gunakan konfigurasi multer dengan storage dan fileFilter yang sudah dibuat
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

// ===================== ROUTES =====================
// Get semua keluarga
router.get("/", protect, getAllKeluarga);

// Get keluarga by no_kk
router.get("/:no_kk", protect, getKeluargaByNoKK);

// Create keluarga
router.post("/", protect, createKeluarga);

// Update keluarga
router.put("/:no_kk", protect, updateKeluarga);

// Delete keluarga
router.delete("/:no_kk", protect, deleteKeluarga);

// Import Excel keluarga
router.post("/import", protect, upload.single("file"), importKeluarga);

export default router;
