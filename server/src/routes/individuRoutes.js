import express from "express";
import multer from "multer";
import path from "path";
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

router.get("/", protect, getAllIndividu);
router.get("/:nik", protect, getIndividuByNik);
router.post("/", protect, createIndividu);
router.put("/:nik", protect, updateIndividu);
router.delete("/:nik", protect, deleteIndividu);

router.post("/import", protect, upload.single("file"), importIndividu);

export default router;
