import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import db from "./src/config/db.js";
import authRoutes from "./src/routes/authRoutes.js";

dotenv.config();
const app = express();

// CORS - allow your frontend origin only in production
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Simple health check
app.get("/", (req, res) => {
  res.send("Backend is running...");
});

// API auth Endpoint
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// NOTE: If you are testing locally over HTTP, keep COOKIE_SECURE=false in .env.
// In production (HTTPS) set COOKIE_SECURE=true.
