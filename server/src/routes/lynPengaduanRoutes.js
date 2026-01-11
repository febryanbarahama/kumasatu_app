import express from "express";
import {
  getAllPengaduan,
  getPengaduanById,
  createPengaduan,
  updatePengaduan,
  deletePengaduan,
} from "../controllers/lynPengaduanController.js";

import upload from "../middlewares/uploadCloudinary.js";

const router = express.Router();

/**
 * =========================
 * GET
 * =========================
 */
router.get("/", getAllPengaduan);
router.get("/:id", getPengaduanById);

/**
 * =========================
 * CREATE (PUBLIC + FILE)
 * =========================
 */
router.post(
  "/",
  upload.fields([
    { name: "lampiran_foto", maxCount: 5 },
    { name: "lampiran_video", maxCount: 1 },
    { name: "lampiran_lainnya", maxCount: 3 },
  ]),
  createPengaduan
);

/**
 * =========================
 * UPDATE STATUS (ADMIN)
 * =========================
 */
router.put("/:id", updatePengaduan);

/**
 * =========================
 * DELETE
 * =========================
 */
router.delete("/:id", deletePengaduan);

export default router;
