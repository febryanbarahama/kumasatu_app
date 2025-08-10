import express from "express";
import {
  createIndividu,
  getAllIndividu,
  getIndividuByNik,
  updateIndividu,
  deleteIndividu,
} from "../controllers/individuController.js";
import protect from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getAllIndividu);
router.get("/:nik", protect, getIndividuByNik);
router.post("/", protect, createIndividu);
router.put("/:nik", protect, updateIndividu);
router.delete("/:nik", protect, deleteIndividu);

export default router;
