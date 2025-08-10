import express from "express";
import {
  getAllKeluarga,
  getKeluargaByNoKK,
  createKeluarga,
  updateKeluarga,
  deleteKeluarga,
} from "../controllers/keluargaController.js";

import protect from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getAllKeluarga);
router.get("/:no_kk", protect, getKeluargaByNoKK);
router.post("/", protect, createKeluarga);
router.put("/:no_kk", protect, updateKeluarga);
router.delete("/:no_kk", protect, deleteKeluarga);

export default router;
