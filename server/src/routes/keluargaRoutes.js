import express from "express";
import multer from "multer";
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

/* =======================
   MULTER (MEMORY STORAGE)
   AMAN UNTUK VERCEL
======================= */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Hanya file Excel (.xls, .xlsx) yang diizinkan"), false);
    }
  },
});

/* =======================
   ROUTES
======================= */

// IMPORT HARUS DI ATAS PARAM
router.post("/import", protect, upload.single("file"), importKeluarga);

// CRUD
router.get("/", protect, getAllKeluarga);
router.get("/:no_kk", protect, getKeluargaByNoKK);
router.post("/", protect, createKeluarga);
router.put("/:no_kk", protect, updateKeluarga);
router.delete("/:no_kk", protect, deleteKeluarga);

export default router;
