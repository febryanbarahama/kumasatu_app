import express from "express";
import {
  getAllAparatur,
  getAparaturById,
  createAparatur,
  updateAparatur,
  deleteAparatur,
} from "../controllers/aparaturController.js";

import protect from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadCloudinary.js";

const router = express.Router();

// =======================
// PUBLIC
// =======================
router.get("/", getAllAparatur);
router.get("/:id", getAparaturById);

// =======================
// ADMIN ONLY
// =======================
router.post("/", protect, upload.single("image"), createAparatur);
router.put("/:id", protect, upload.single("image"), updateAparatur);
router.delete("/:id", protect, deleteAparatur);

export default router;
