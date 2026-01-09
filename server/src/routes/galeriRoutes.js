import express from "express";
import {
  getAllGaleri,
  getGaleriById,
  createGaleri,
  updateGaleri,
  deleteGaleri,
} from "../controllers/galeriController.js";

import { uploadImage } from "../controllers/uploadController.js";
import protect from "../middlewares/authMiddleware.js";

const router = express.Router();

// PUBLIC
router.get("/", getAllGaleri);
router.get("/:id", getGaleriById);

// ADMIN (protected)
router.post("/", protect, uploadImage, createGaleri);
router.put("/:id", protect, uploadImage, updateGaleri);
router.delete("/:id", protect, deleteGaleri);

export default router;
