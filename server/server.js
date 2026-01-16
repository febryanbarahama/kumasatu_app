import express from "express";
import dotenv from "dotenv";
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

/* ===================== CORS (MANUAL & VERCEL SAFE) ===================== */
const allowedOrigins = [
  "http://localhost:5173",
  "https://admin.pemkampkuma1.id",
  "https://pemkampkuma1.id",
];

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );

  // 🔴 KUNCI UTAMA: STOP PREFLIGHT DI SINI
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
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
