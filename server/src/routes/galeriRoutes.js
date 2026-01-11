import express from "express";
import {
  getAllGaleri,
  getGaleriById,
  createGaleri,
  updateGaleri,
  deleteGaleri,
} from "../controllers/galeriController.js";

import upload from "../middlewares/uploadCloudinary.js";
import protect from "../middlewares/authMiddleware.js";

const router = express.Router();

// =======================
// PUBLIC
// =======================
router.get("/", getAllGaleri);
router.get("/:id", getGaleriById);

// =======================
// ADMIN (PROTECTED)
// =======================
router.post(
  "/",
  protect,
  upload.single("image"), // ⬅️ field name harus sama dengan frontend
  createGaleri
);

router.put("/:id", protect, upload.single("image"), updateGaleri);

router.delete("/:id", protect, deleteGaleri);

export default router;
