import express from "express";
import {
  loginUser,
  getUser,
  refreshAccessToken,
  logoutUser,
  updateUser,
  changePassword,
} from "../controllers/authController.js";

import protect from "../middlewares/authMiddleware.js";

const router = express.Router();

// =======================
// AUTH (PUBLIC)
// =======================

router.post("/login", loginUser);
router.post("/refresh", refreshAccessToken);

// =======================
// AUTH (PROTECTED)
// =======================
router.post("/logout", protect, logoutUser);

// =======================
// USER PROFILE (PROTECTED)
// =======================
router.get("/me", protect, getUser);
router.put("/me", protect, updateUser);
router.put("/change-password", protect, changePassword);

// =======================
// TEST (OPTIONAL)
// =======================
router.get("/debug", protect, (req, res) => {
  res.json({
    message: "Auth OK",
    user: req.user,
  });
});

export default router;
