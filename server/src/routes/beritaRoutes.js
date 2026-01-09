import express from "express";
import {
  getAllBerita,
  getBeritaById,
  createBerita,
  updateBerita,
  deleteBerita,
} from "../controllers/beritaController.js";

import protect from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadCloudinary.js";

const router = express.Router();

// =======================
// PUBLIC
// =======================
router.get("/", getAllBerita);
router.get("/:id", getBeritaById);

// =======================
// ADMIN / AUTH REQUIRED
// =======================
router.post(
  "/",
  protect,
  upload.single("image"), // ✅ WAJIB
  createBerita
);

router.put(
  "/:id",
  protect,
  upload.single("image"), // ✅ WAJIB
  updateBerita
);

router.delete("/:id", protect, deleteBerita);

export default router;
