import getPool from "../config/db.js";

// =============================
// GET semua galeri
// =============================
export const getAllGaleri = async (req, res) => {
  try {
    const pool = getPool();
    const [rows] = await pool.query("SELECT * FROM galeri ORDER BY date DESC");
    res.json(rows);
  } catch (error) {
    console.error("Gagal mengambil data galeri:", error);
    res.status(500).json({
      message: "Terjadi kesalahan pada server.",
    });
  }
};

// =============================
// GET galeri by ID
// =============================
export const getGaleriById = async (req, res) => {
  try {
    const pool = getPool();
    const [rows] = await pool.query("SELECT * FROM galeri WHERE id = ?", [
      req.params.id,
    ]);

    if (!rows.length) {
      return res.status(404).json({
        message: "Data galeri tidak ditemukan.",
      });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Gagal mengambil galeri:", error);
    res.status(500).json({
      message: "Terjadi kesalahan pada server.",
    });
  }
};

// =============================
// CREATE galeri (Cloudinary)
// =============================
export const createGaleri = async (req, res) => {
  try {
    const pool = getPool();
    const { title, description, category, date, author, status } = req.body;

    const image = req.file?.path; // ✅ URL Cloudinary

    if (!title || !image || !author) {
      return res.status(400).json({
        message: "Judul, gambar, dan author wajib diisi.",
      });
    }

    const [result] = await pool.query(
      `INSERT INTO galeri
       (title, description, image, category, date, author, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        title,
        description || null,
        image,
        category || null,
        date || null,
        author,
        status || "active",
      ]
    );

    res.status(201).json({
      message: "Galeri berhasil ditambahkan.",
      id: result.insertId,
    });
  } catch (error) {
    console.error("Gagal menambah galeri:", error);
    res.status(500).json({
      message: "Terjadi kesalahan pada server.",
    });
  }
};

// =============================
// UPDATE galeri
// =============================
export const updateGaleri = async (req, res) => {
  try {
    const pool = getPool();
    const { id } = req.params;
    const {
      title,
      description,
      category,
      date,
      author,
      status,
      image: oldImage,
    } = req.body;

    const image = req.file?.path || oldImage; // ✅ aman

    const [result] = await pool.query(
      `UPDATE galeri
       SET title = ?, description = ?, image = ?, category = ?, date = ?, author = ?, status = ?, updated_at = NOW()
       WHERE id = ?`,
      [
        title,
        description || null,
        image,
        category || null,
        date || null,
        author,
        status || "active",
        id,
      ]
    );

    if (!result.affectedRows) {
      return res.status(404).json({
        message: "Data galeri tidak ditemukan.",
      });
    }

    res.json({ message: "Galeri berhasil diperbarui." });
  } catch (error) {
    console.error("Gagal update galeri:", error);
    res.status(500).json({
      message: "Terjadi kesalahan pada server.",
    });
  }
};

// =============================
// DELETE galeri
// =============================
export const deleteGaleri = async (req, res) => {
  try {
    const pool = getPool();
    const { id } = req.params;

    const [result] = await pool.query("DELETE FROM galeri WHERE id = ?", [id]);

    if (!result.affectedRows) {
      return res.status(404).json({
        message: "Data galeri tidak ditemukan.",
      });
    }

    res.json({ message: "Galeri berhasil dihapus." });
  } catch (error) {
    console.error("Gagal hapus galeri:", error);
    res.status(500).json({
      message: "Terjadi kesalahan pada server.",
    });
  }
};
