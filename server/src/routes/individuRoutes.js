import express from "express";
import multer from "multer";
import {
  createIndividu,
  getAllIndividu,
  getIndividuByNik,
  updateIndividu,
  deleteIndividu,
  importIndividu,
} from "../controllers/individuController.js";
import protect from "../middlewares/authMiddleware.js";

const router = express.Router();

// ===================== MULTER MEMORY (VERCEL SAFE) =====================
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
      cb(new Error("Hanya file Excel (.xlsx atau .xls) yang diizinkan"));
    }
  },
});

// ===================== CRUD =====================
router.get("/", protect, getAllIndividu);
router.get("/:nik", protect, getIndividuByNik);
router.post("/", protect, createIndividu);
router.put("/:nik", protect, updateIndividu);
router.delete("/:nik", protect, deleteIndividu);

// ===================== IMPORT =====================
router.post("/import", protect, upload.single("file"), importIndividu);

export default router;
