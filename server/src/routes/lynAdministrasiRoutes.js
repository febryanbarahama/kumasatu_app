import express from "express";
import {
  getAllAdministrasi,
  getAdministrasiById,
  createAdministrasi,
  updateAdministrasi,
  deleteAdministrasi,
} from "../controllers/lynAdministrasiController.js";

import protect from "../middleware/authMiddleware.js";
import uploadLampiran from "../middleware/uploadLampiranCloudinary.js";

const router = express.Router();

// =======================
// PUBLIC
// =======================
router.get("/", getAllAdministrasi);
router.get("/:id", getAdministrasiById);

// =======================
// CREATE (UPLOAD LAMPIRAN)
// =======================
// lampiran_ktp
// lampiran_kk
// lampiran_lainnya
router.post(
  "/",
  uploadLampiran.fields([
    { name: "lampiran_ktp", maxCount: 1 },
    { name: "lampiran_kk", maxCount: 1 },
    { name: "lampiran_lainnya", maxCount: 1 },
  ]),
  createAdministrasi
);

// =======================
// ADMIN / AUTH REQUIRED
// =======================
router.put("/:id", protect, updateAdministrasi);
router.delete("/:id", protect, deleteAdministrasi);

export default router;
