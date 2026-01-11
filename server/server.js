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

// ===================== CORS =====================
const allowedOrigins = [
  "https://admin.pemkampkuma1.id",
  "https://pemkampkuma1.id",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
    credentials: true,
  })
);

// ===================== MIDDLEWARE =====================
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));
app.use(cookieParser());

// ===================== HEALTH CHECK =====================
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Backend is running" });
});

// ===================== ROUTES =====================
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
