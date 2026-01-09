import express from "express";
import { getDashboardData } from "../controllers/dashboardController.js";
import protect from "../middlewares/authMiddleware.js";

const router = express.Router();

// =======================
// DASHBOARD (ADMIN ONLY)
// =======================
router.get("/", getDashboardData);

export default router;
