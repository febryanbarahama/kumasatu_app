import getPool from "../config/db.js";
import cloudinary from "../config/cloudinaryClient.js";

/* =========================
   HELPER: Ambil public_id Cloudinary
========================= */
const getPublicId = (url) => {
  try {
    if (!url) return null;

    const parts = url.split("/");
    const file = parts.slice(-2).join("/"); // folder + filename
    return file.split(".")[0];
  } catch {
    return null;
  }
};

/* =========================
   GET semua galeri
========================= */
export const getAllGaleri = async (req, res) => {
  try {
    const pool = getPool();

    const [rows] = await pool.query("SELECT * FROM galeri ORDER BY date DESC");

    // 🔥 normalize (hindari path lama)
    const normalized = rows.map((item) => ({
      ...item,
      image: item.image?.startsWith("http") ? item.image : null,
    }));

    res.json(normalized);
  } catch (error) {
    console.error("Gagal mengambil data galeri:", error);
    res.status(500).json({
      message: "Terjadi kesalahan pada server.",
    });
  }
};

/* =========================
   GET galeri by ID
========================= */
export const getGaleriById = async (req, res) => {
  try {
    const pool = getPool();
    const id = Number(req.params.id);

    if (!id) {
      return res.status(400).json({
        message: "ID tidak valid.",
      });
    }

    const [[galeri]] = await pool.query(
      "SELECT * FROM galeri WHERE id = ? LIMIT 1",
      [id],
    );

    if (!galeri) {
      return res.status(404).json({
        message: "Data galeri tidak ditemukan.",
      });
    }

    // 🔥 normalize
    galeri.image = galeri.image?.startsWith("http") ? galeri.image : null;

    res.json(galeri);
  } catch (error) {
    console.error("Gagal mengambil galeri:", error);
    res.status(500).json({
      message: "Terjadi kesalahan pada server.",
    });
  }
};

/* =========================
   CREATE galeri
========================= */
export const createGaleri = async (req, res) => {
  try {
    const pool = getPool();
    const { title, description, category, date, author, status } = req.body;

    if (!title || !author) {
      return res.status(400).json({
        message: "Judul dan author wajib diisi.",
      });
    }

    // ✅ wajib cloudinary
    if (!req.file || !req.file.secure_url) {
      return res.status(400).json({
        message: "Upload gambar gagal.",
      });
    }

    const image = req.file.secure_url;

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
      ],
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

/* =========================
   UPDATE galeri
========================= */
export const updateGaleri = async (req, res) => {
  try {
    const pool = getPool();
    const id = Number(req.params.id);

    if (!id) {
      return res.status(400).json({
        message: "ID tidak valid.",
      });
    }

    const { title, description, category, date, author, status } = req.body;

    const [[existing]] = await pool.query(
      "SELECT image FROM galeri WHERE id = ? LIMIT 1",
      [id],
    );

    if (!existing) {
      return res.status(404).json({
        message: "Data galeri tidak ditemukan.",
      });
    }

    let image = existing.image;

    /* =========================
       PRIORITY UPDATE IMAGE
    ========================= */

    // ✅ 1. upload via multer
    if (req.file && req.file.secure_url) {
      // hapus lama kalau cloudinary
      if (existing.image && existing.image.startsWith("http")) {
        const publicId = getPublicId(existing.image);
        if (publicId) {
          await cloudinary.uploader.destroy(publicId);
        }
      }

      image = req.file.secure_url;
    }

    // ✅ 2. kirim URL dari frontend
    else if (req.body.image && req.body.image.startsWith("http")) {
      image = req.body.image;
    }

    await pool.query(
      `UPDATE galeri SET
        title = ?, 
        description = ?, 
        image = ?, 
        category = ?, 
        date = ?, 
        author = ?, 
        status = ?, 
        updated_at = NOW()
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
      ],
    );

    res.json({ message: "Galeri berhasil diperbarui." });
  } catch (error) {
    console.error("Gagal update galeri:", error);
    res.status(500).json({
      message: "Terjadi kesalahan pada server.",
    });
  }
};

/* =========================
   DELETE galeri
========================= */
export const deleteGaleri = async (req, res) => {
  try {
    const pool = getPool();
    const id = Number(req.params.id);

    const [[existing]] = await pool.query(
      "SELECT image FROM galeri WHERE id = ? LIMIT 1",
      [id],
    );

    if (!existing) {
      return res.status(404).json({
        message: "Data galeri tidak ditemukan.",
      });
    }

    // ✅ hapus hanya kalau cloudinary
    if (existing.image && existing.image.startsWith("http")) {
      const publicId = getPublicId(existing.image);
      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
      }
    }

    await pool.query("DELETE FROM galeri WHERE id = ?", [id]);

    res.json({ message: "Galeri berhasil dihapus." });
  } catch (error) {
    console.error("Gagal hapus galeri:", error);
    res.status(500).json({
      message: "Terjadi kesalahan pada server.",
    });
  }
};
