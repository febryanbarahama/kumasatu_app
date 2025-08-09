import express from "express";
import {
  registerUser,
  loginUser,
  getUser,
  refreshAccessToken,
  logoutUser,
} from "../controllers/authController.js";
import protect from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh", refreshAccessToken);
router.post("/logout", protect, logoutUser);
router.get("/profile", protect, getUser);

router.get("/dashboard", protect, (req, res) => {
  res.json(req.user);
});

export default router;
