import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getPool from "../config/db.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken.js";

/* =========================
   REFRESH TOKEN HELPERS
========================= */
const storeRefreshToken = async (token, userId) => {
  const pool = getPool();
  await pool.query(
    "INSERT INTO refresh_tokens (token, user_id, created_at) VALUES (?, ?, NOW())",
    [token, userId]
  );
};

const removeRefreshToken = async (token) => {
  const pool = getPool();
  await pool.query("DELETE FROM refresh_tokens WHERE token = ?", [token]);
};

const findRefreshToken = async (token) => {
  const pool = getPool();
  const [rows] = await pool.query(
    "SELECT user_id FROM refresh_tokens WHERE token = ? LIMIT 1",
    [token]
  );
  return rows[0];
};

/* =========================
   COOKIE OPTIONS (VERCEL SAFE)
========================= */
const cookieOptions = {
  httpOnly: true,
  secure: true, // Vercel = HTTPS
  sameSite: "none", // cross-domain
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

/* =========================
   GET USER
========================= */
export const getUser = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "User tidak ditemukan" });
  }

  res.json({
    id: req.user.id_pengguna || req.user.id,
    name: req.user.nama_pengguna || req.user.name,
    email: req.user.email,
    username: req.user.username,
  });
};

/* =========================
   UPDATE USER
========================= */
export const updateUser = async (req, res) => {
  try {
    const pool = getPool();
    const userId = req.user?.id_pengguna || req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Token tidak valid" });
    }

    const { email, username } = req.body;
    if (!email || !username) {
      return res
        .status(400)
        .json({ message: "Email dan username wajib diisi" });
    }

    const [[user]] = await pool.query(
      "SELECT id_pengguna FROM users WHERE id_pengguna = ? LIMIT 1",
      [userId]
    );
    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    const [exists] = await pool.query(
      `SELECT id_pengguna FROM users 
       WHERE (email = ? OR username = ?) AND id_pengguna != ? LIMIT 1`,
      [email, username, userId]
    );
    if (exists.length) {
      return res
        .status(400)
        .json({ message: "Email atau username sudah digunakan" });
    }

    await pool.query(
      "UPDATE users SET email = ?, username = ? WHERE id_pengguna = ?",
      [email, username, userId]
    );

    res.json({ message: "Data akun berhasil diperbarui" });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   CHANGE PASSWORD
========================= */
export const changePassword = async (req, res) => {
  try {
    const pool = getPool();
    const userId = req.user?.id_pengguna || req.user?.id;
    const { password_lama, password_baru } = req.body;

    if (!password_lama || !password_baru) {
      return res.status(400).json({ message: "Semua field wajib diisi" });
    }

    const [[user]] = await pool.query(
      "SELECT password FROM users WHERE id_pengguna = ? LIMIT 1",
      [userId]
    );

    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    const isMatch = await bcrypt.compare(password_lama, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Password lama salah" });
    }

    const hashed = await bcrypt.hash(password_baru, 10);
    await pool.query("UPDATE users SET password = ? WHERE id_pengguna = ?", [
      hashed,
      userId,
    ]);

    res.json({ message: "Password berhasil diubah" });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   LOGIN
========================= */
export const loginUser = async (req, res) => {
  try {
    const pool = getPool();
    const { username, password } = req.body;

    const [[user]] = await pool.query(
      "SELECT * FROM users WHERE username = ? LIMIT 1",
      [username]
    );

    if (!user) {
      return res.status(400).json({ message: "Username tidak ditemukan" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Password salah" });
    }

    const userId = user.id_pengguna;
    const accessToken = generateAccessToken({ id: userId });
    const refreshToken = generateRefreshToken({ id: userId });

    await storeRefreshToken(refreshToken, userId);

    res.cookie("refreshToken", refreshToken, cookieOptions);

    res.json({
      id: userId,
      name: user.nama_pengguna,
      email: user.email,
      username: user.username,
      accessToken,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   REFRESH TOKEN (ROTATE)
========================= */
export const refreshAccessToken = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) {
    return res.status(401).json({ message: "Refresh token tidak ditemukan" });
  }

  try {
    const stored = await findRefreshToken(token);
    if (!stored) {
      return res.status(403).json({ message: "Refresh token tidak valid" });
    }

    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

    await removeRefreshToken(token);

    const newRefreshToken = generateRefreshToken({ id: stored.user_id });
    await storeRefreshToken(newRefreshToken, stored.user_id);

    const newAccessToken = generateAccessToken({ id: stored.user_id });

    res.cookie("refreshToken", newRefreshToken, cookieOptions);

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    console.error("Refresh token error:", error);
    res.status(403).json({ message: "Refresh token tidak valid" });
  }
};

/* =========================
   LOGOUT
========================= */
export const logoutUser = async (req, res) => {
  const token = req.cookies.refreshToken;

  if (token) {
    await removeRefreshToken(token);
  }

  res.clearCookie("refreshToken", cookieOptions);
  res.json({ message: "Logout berhasil" });
};
