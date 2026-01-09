import getPool from "../config/db.js";
import cloudinary from "../config/cloudinary.js";

/* =========================
   GET semua berita
========================= */
export const getAllBerita = async (req, res) => {
  try {
    const pool = getPool();
    const [rows] = await pool.query(
      `SELECT 
        id, title, slug, excerpt, image, category, author, date, created_at
       FROM berita
       ORDER BY created_at DESC`
    );

    res.status(200).json(rows);
  } catch (error) {
    console.error("Gagal mengambil berita:", error);
    res.status(500).json({ message: "Gagal mengambil data berita" });
  }
};

/* =========================
   GET berita by ID
========================= */
export const getBeritaById = async (req, res) => {
  try {
    const pool = getPool();
    const { id } = req.params;

    const [[berita]] = await pool.query(
      "SELECT * FROM berita WHERE id = ? LIMIT 1",
      [id]
    );

    if (!berita) {
      return res.status(404).json({ message: "Berita tidak ditemukan" });
    }

    res.status(200).json(berita);
  } catch (error) {
    console.error("Gagal mengambil berita:", error);
    res.status(500).json({ message: "Gagal mengambil data berita" });
  }
};

/* =========================
   CREATE berita
========================= */
export const createBerita = async (req, res) => {
  try {
    const pool = getPool();
    const { title, slug, excerpt, content, category, author, date } = req.body;

    if (!title || !slug || !content) {
      return res
        .status(400)
        .json({ message: "Field wajib: title, slug, content" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Gambar wajib diupload" });
    }

    // cek slug duplikat
    const [[existing]] = await pool.query(
      "SELECT id FROM berita WHERE slug = ? LIMIT 1",
      [slug]
    );

    if (existing) {
      return res.status(409).json({ message: "Slug sudah digunakan" });
    }

    const imageUrl = req.file.path; // ✅ Cloudinary URL
    const publishDate = date || new Date();

    const [result] = await pool.query(
      `INSERT INTO berita
       (title, slug, excerpt, content, image, category, author, date)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        slug,
        excerpt || null,
        content,
        imageUrl,
        category || null,
        author || null,
        publishDate,
      ]
    );

    res.status(201).json({
      message: "Berita berhasil ditambahkan",
      id: result.insertId,
    });
  } catch (error) {
    console.error("Gagal menambah berita:", error);
    res.status(500).json({ message: "Gagal menambah berita" });
  }
};

/* =========================
   UPDATE berita
========================= */
export const updateBerita = async (req, res) => {
  try {
    const pool = getPool();
    const { id } = req.params;
    const { title, slug, excerpt, content, category, author, date } = req.body;

    // Ambil data lama
    const [[existing]] = await pool.query(
      "SELECT image FROM berita WHERE id = ? LIMIT 1",
      [id]
    );

    if (!existing) {
      return res.status(404).json({ message: "Berita tidak ditemukan" });
    }

    // Jika upload gambar baru → pakai yang baru
    const imageUrl = req.file ? req.file.path : existing.image;

    const [result] = await pool.query(
      `UPDATE berita
       SET title=?, slug=?, excerpt=?, content=?, image=?, category=?, author=?, date=?
       WHERE id=?`,
      [
        title,
        slug,
        excerpt || null,
        content,
        imageUrl,
        category || null,
        author || null,
        date || new Date(),
        id,
      ]
    );

    res.status(200).json({ message: "Berita berhasil diperbarui" });
  } catch (error) {
    console.error("Gagal update berita:", error);
    res.status(500).json({ message: "Gagal memperbarui berita" });
  }
};

/* =========================
   DELETE berita
========================= */
export const deleteBerita = async (req, res) => {
  try {
    const pool = getPool();
    const { id } = req.params;

    const [[berita]] = await pool.query(
      "SELECT image FROM berita WHERE id = ? LIMIT 1",
      [id]
    );

    if (!berita) {
      return res.status(404).json({ message: "Berita tidak ditemukan" });
    }

    // 🔥 Hapus gambar dari Cloudinary (opsional tapi direkomendasikan)
    if (berita.image) {
      const publicId = berita.image.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`berita/${publicId}`);
    }

    await pool.query("DELETE FROM berita WHERE id = ?", [id]);

    res.status(200).json({ message: "Berita berhasil dihapus" });
  } catch (error) {
    console.error("Gagal hapus berita:", error);
    res.status(500).json({ message: "Gagal menghapus berita" });
  }
};
