import express from "express";
import {
  getAllAgenda,
  getAgendaById,
  createAgenda,
  updateAgenda,
  deleteAgenda,
} from "../controllers/agendaController.js";

import protect from "../middlewares/authMiddleware.js";

import upload from "../middlewares/uploadCloudinary.js";

const router = express.Router();

// =======================
// PUBLIC
// =======================
router.get("/", getAllAgenda);
router.get("/:id", getAgendaById);

// =======================
// ADMIN ONLY
// =======================
router.post(
  "/",
  protect,

  upload.single("image"), // 🔥 Cloudinary
  createAgenda
);

router.put(
  "/:id",
  protect,

  upload.single("image"), // 🔥 Cloudinary
  updateAgenda
);

router.delete("/:id", protect, deleteAgenda);

export default router;
