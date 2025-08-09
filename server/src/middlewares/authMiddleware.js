import jwt from "jsonwebtoken";
import db from "../config/db.js";

const protect = (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

      db.query(
        "SELECT id_pengguna, nama_pengguna, email, username FROM users WHERE id_pengguna = ?",
        [decoded.id],
        (err, results) => {
          if (err)
            return res
              .status(500)
              .json({ message: "Server error", error: err });
          if (results.length === 0)
            return res.status(404).json({ message: "User tidak ditemukan" });

          req.user = results[0];
          next();
        }
      );
    } catch (error) {
      return res.status(401).json({ message: "Token tidak valid" });
    }
  }

  if (!token) {
    return res
      .status(401)
      .json({ message: "Tidak ada token, otorisasi ditolak" });
  }
};

export default protect;
