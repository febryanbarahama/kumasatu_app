import jwt from "jsonwebtoken";
import db from "../config/db.js";

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];

    try {
      // Verifikasi JWT
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

      // Ambil user dari database
      const [results] = await db.query(
        "SELECT id_pengguna, nama_pengguna, email, username FROM users WHERE id_pengguna = ?",
        [decoded.id]
      );

      if (results.length === 0) {
        return res.status(404).json({ message: "User tidak ditemukan" });
      }

      req.user = results[0];
      return next();
    } catch (error) {
      return res.status(401).json({ message: "Token tidak valid" });
    }
  }

  // Kalau token kosong
  if (!token) {
    return res
      .status(401)
      .json({ message: "Tidak ada token, otorisasi ditolak" });
  }
};

export default protect;
