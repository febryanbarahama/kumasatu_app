import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./src/routes/authRoutes.js";
import keluargaRoutes from "./src/routes/keluargaRoutes.js";
import individuRoutes from "./src/routes/individuRoutes.js";
import dashboardRoutes from "./src/routes/dashboardRoutes.js";
import beritaRoutes from "./src/routes/beritaRoutes.js";
import agendaRoutes from "./src/routes/agendaRoutes.js";
import galeriRoutes from "./src/routes/galeriRoutes.js";
import aparaturRoutes from "./src/routes/aparaturRoutes.js";
import administrasiRoutes from "./src/routes/lynAdministrasiRoutes.js";
import pengaduanRoutes from "./src/routes/lynPengaduanRoutes.js";
import uploadRoutes from "./src/routes/uploadRoutes.js";

dotenv.config();

const app = express();

/* ===================== TRUST PROXY (WAJIB DI VERCEL) ===================== */
app.set("trust proxy", 1);

/* ===================== CORS ===================== */
const allowedOrigins = [
  "http://localhost:5173",
  "https://admin.pemkampkuma1.id",
  "https://pemkampkuma1.id",
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, origin);
    }
    return callback(new Error("CORS not allowed"), false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

/* ===== FIX PREFLIGHT (VERCEL SAFE) ===== */
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    return cors(corsOptions)(req, res, next);
  }
  next();
});

/* ===================== MIDDLEWARE ===================== */
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));
app.use(cookieParser());

/* ===================== HEALTH CHECK ===================== */
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Backend is running" });
});

/* ===================== ROUTES ===================== */
app.use("/api/auth", authRoutes);
app.use("/api/keluarga", keluargaRoutes);
app.use("/api/individu", individuRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/berita", beritaRoutes);
app.use("/api/agenda", agendaRoutes);
app.use("/api/galeri", galeriRoutes);
app.use("/api/aparatur", aparaturRoutes);
app.use("/api/administrasi", administrasiRoutes);
app.use("/api/pengaduan", pengaduanRoutes);
app.use("/api/upload", uploadRoutes);

export default app;
