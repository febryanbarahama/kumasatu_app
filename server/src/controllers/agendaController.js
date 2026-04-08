import getPool from "../config/db.js";
import cloudinary from "../config/cloudinaryClient.js";

/* =========================
   HELPER: ambil publicId dari URL
========================= */
const getPublicId = (url) => {
  try {
    if (!url || !url.includes("cloudinary")) return null;

    const parts = url.split("/");
    const fileName = parts[parts.length - 1];
    const publicId = fileName.split(".")[0];

    // jika pakai folder (misalnya agenda/)
    const folderIndex = parts.findIndex((p) => p === "upload") + 1;
    const folderPath = parts.slice(folderIndex, parts.length - 1).join("/");

    return folderPath ? `${folderPath}/${publicId}` : publicId;
  } catch {
    return null;
  }
};

/* =========================
   GET ALL AGENDA
========================= */
export const getAllAgenda = async (req, res) => {
  try {
    const pool = getPool();

    const limit = Number(req.query.limit) || 50;
    const offset = Number(req.query.offset) || 0;

    const [rows] = await pool.query(
      `SELECT * FROM agenda 
       ORDER BY date DESC 
       LIMIT ? OFFSET ?`,
      [limit, offset],
    );

    res.status(200).json(rows);
  } catch (error) {
    console.error("Gagal mengambil data agenda:", error);
    res.status(500).json({
      message: "Terjadi kesalahan pada server saat mengambil data agenda.",
    });
  }
};

/* =========================
   GET AGENDA BY ID
========================= */
export const getAgendaById = async (req, res) => {
  try {
    const pool = getPool();
    const id = Number(req.params.id);

    if (!id) {
      return res.status(400).json({ message: "ID agenda tidak valid." });
    }

    const [rows] = await pool.query(
      "SELECT * FROM agenda WHERE id = ? LIMIT 1",
      [id],
    );

    if (!rows.length) {
      return res.status(404).json({ message: "Data agenda tidak ditemukan." });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error("Gagal mengambil agenda:", error);
    res.status(500).json({
      message: "Terjadi kesalahan pada server.",
    });
  }
};

/* =========================
   CREATE AGENDA
========================= */
export const createAgenda = async (req, res) => {
  try {
    const pool = getPool();
    const { title, date, time, location, category, description, image } =
      req.body;

    if (!title || !date || !location) {
      return res.status(400).json({
        message: "Judul, tanggal, dan lokasi wajib diisi.",
      });
    }

    // 🔥 FIX: fleksibel (upload / URL manual)
    const imageUrl = req.file?.secure_url || req.file?.path || image || null;

    const [result] = await pool.query(
      `INSERT INTO agenda 
      (title, date, time, location, category, image, description, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        title,
        date,
        time || null,
        location,
        category || null,
        imageUrl,
        description || null,
      ],
    );

    res.status(201).json({
      message: "Agenda berhasil ditambahkan.",
      id: result.insertId,
    });
  } catch (error) {
    console.error("Gagal menambahkan agenda:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server." });
  }
};

/* =========================
   UPDATE AGENDA
========================= */
export const updateAgenda = async (req, res) => {
  try {
    const pool = getPool();
    const id = Number(req.params.id);

    if (!id) {
      return res.status(400).json({ message: "ID agenda tidak valid." });
    }

    const { title, date, time, location, category, description, image } =
      req.body;

    const [[existing]] = await pool.query(
      "SELECT image FROM agenda WHERE id = ? LIMIT 1",
      [id],
    );

    if (!existing) {
      return res.status(404).json({ message: "Agenda tidak ditemukan." });
    }

    let imageUrl = existing.image;

    // 🔥 FIX: jika upload baru
    if (req.file) {
      const publicId = getPublicId(existing.image);
      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
      }

      imageUrl = req.file.secure_url || req.file.path;
    }

    // 🔥 FIX: jika kirim URL manual dari frontend
    if (!req.file && image && image !== existing.image) {
      const publicId = getPublicId(existing.image);
      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
      }

      imageUrl = image;
    }

    await pool.query(
      `UPDATE agenda SET
        title = ?, 
        date = ?, 
        time = ?, 
        location = ?, 
        category = ?, 
        image = ?, 
        description = ?, 
        updated_at = NOW()
       WHERE id = ?`,
      [
        title,
        date,
        time || null,
        location,
        category || null,
        imageUrl,
        description || null,
        id,
      ],
    );

    res.status(200).json({
      message: "Agenda berhasil diperbarui.",
    });
  } catch (error) {
    console.error("Gagal update agenda:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server." });
  }
};

/* =========================
   DELETE AGENDA
========================= */
export const deleteAgenda = async (req, res) => {
  try {
    const pool = getPool();
    const id = Number(req.params.id);

    const [[existing]] = await pool.query(
      "SELECT image FROM agenda WHERE id = ? LIMIT 1",
      [id],
    );

    if (!existing) {
      return res.status(404).json({ message: "Agenda tidak ditemukan." });
    }

    // 🔥 FIX: hapus dari cloudinary dengan aman
    const publicId = getPublicId(existing.image);
    if (publicId) {
      await cloudinary.uploader.destroy(publicId);
    }

    await pool.query("DELETE FROM agenda WHERE id = ?", [id]);

    res.status(200).json({
      message: "Agenda berhasil dihapus.",
    });
  } catch (error) {
    console.error("Gagal hapus agenda:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server." });
  }
};
