import bcrypt from "bcryptjs";
import db from "../config/db.js";
import jwt from "jsonwebtoken";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken.js";

// Simpan refresh token ke DB
const storeRefreshToken = async (token, userId) => {
  await db.query("INSERT INTO refresh_tokens (token, user_id) VALUES (?, ?)", [
    token,
    userId,
  ]);
};

const removeRefreshToken = async (token) => {
  await db.query("DELETE FROM refresh_tokens WHERE token = ?", [token]);
};

const isRefreshTokenValid = async (token) => {
  const [rows] = await db.query(
    "SELECT * FROM refresh_tokens WHERE token = ?",
    [token]
  );
  return rows.length > 0;
};

export const getUser = (req, res) => {
  if (!req.user) {
    return res.status(404).json({ message: "User tidak ditemukan" });
  }

  res.json({
    id: req.user.id_pengguna || req.user.id,
    name: req.user.nama_pengguna || req.user.name,
    email: req.user.email,
    username: req.user.username,
  });
};

export const registerUser = async (req, res) => {
  const { name, email, username, password } = req.body;

  if (!name || !email || !username || !password) {
    return res.status(400).json({ message: "Semua field wajib diisi" });
  }

  try {
    const [existing] = await db.query(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );
    if (existing.length > 0) {
      return res.status(400).json({ message: "Username sudah terdaftar" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const [result] = await db.query(
      "INSERT INTO users (nama_pengguna, email, username, password) VALUES (?, ?, ?, ?)",
      [name, email, username, hashedPassword]
    );

    const userId = result.insertId;
    const accessToken = generateAccessToken({ id: userId });
    const refreshToken = generateRefreshToken({ id: userId });

    await storeRefreshToken(refreshToken, userId);

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.COOKIE_SECURE === "true",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    };

    res.cookie("refreshToken", refreshToken, cookieOptions);

    return res.status(201).json({
      id: userId,
      name,
      email,
      username,
      accessToken,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error", error: err });
  }
};

export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const [results] = await db.query("SELECT * FROM users WHERE username = ?", [
      username,
    ]);
    if (results.length === 0) {
      return res.status(400).json({ message: "Username tidak ditemukan" });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Password salah" });
    }

    const userId = user.id_pengguna || user.id;
    const accessToken = generateAccessToken({ id: userId });
    const refreshToken = generateRefreshToken({ id: userId });

    await storeRefreshToken(refreshToken, userId);

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.COOKIE_SECURE === "true",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    };

    res.cookie("refreshToken", refreshToken, cookieOptions);

    res.json({
      id: userId,
      name: user.nama_pengguna || user.name,
      email: user.email,
      username: user.username,
      accessToken,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error", error: err });
  }
};

export const refreshAccessToken = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token)
    return res.status(401).json({ message: "Refresh token tidak ditemukan" });

  try {
    const valid = await isRefreshTokenValid(token);
    if (!valid) {
      return res.status(403).json({ message: "Refresh token tidak valid" });
    }

    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    const userId = decoded.id;
    const newAccessToken = generateAccessToken({ id: userId });
    return res.json({ accessToken: newAccessToken });
  } catch (error) {
    return res.status(403).json({ message: "Refresh token tidak valid" });
  }
};

export const logoutUser = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (token) {
    try {
      await removeRefreshToken(token);
    } catch (err) {
      console.error("Gagal hapus refresh token:", err);
    }
  }

  res.clearCookie("refreshToken");
  return res.json({ message: "Logout berhasil" });
};
