import jwt from "jsonwebtoken";
import getPool from "../config/db.js";

const protect = async (req, res, next) => {
  try {
    let token;

    // =========================
    // Ambil token (Header / Cookie)
    // =========================
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      return res.status(401).json({
        message: "Token tidak ditemukan, akses ditolak",
      });
    }

    // =========================
    // Verifikasi token
    // =========================
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // =========================
    // Ambil user (minimal field)
    // =========================
    const pool = getPool();
    const [[user]] = await pool.query(
      `SELECT 
        id_pengguna,
        nama_pengguna,
        email,
        username
       FROM users
       WHERE id_pengguna = ?
       LIMIT 1`,
      [decoded.id]
    );

    if (!user) {
      return res.status(401).json({
        message: "User tidak ditemukan",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token sudah kedaluwarsa" });
    }

    if (process.env.NODE_ENV !== "production") {
      console.error("Auth middleware error:", error);
    }

    return res.status(401).json({ message: "Token tidak valid" });
  }
};

export default protect;
