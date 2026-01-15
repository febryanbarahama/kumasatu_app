import getPool from "../config/db.js";
import cloudinary from "../config/cloudinaryClient.js";

/* =========================
   GET ALL APARATUR
========================= */
export const getAllAparatur = async (req, res) => {
  try {
    const pool = getPool();

    const limit = Number(req.query.limit) || 50;
    const offset = Number(req.query.offset) || 0;

    const [rows] = await pool.query(
      "SELECT * FROM aparatur ORDER BY id DESC LIMIT ? OFFSET ?",
      [limit, offset]
    );

    res.status(200).json(rows);
  } catch (error) {
    console.error("Gagal mengambil data aparatur:", error);
    res.status(500).json({
      message: "Terjadi kesalahan saat mengambil data aparatur.",
    });
  }
};

/* =========================
   GET APARATUR BY ID
========================= */
export const getAparaturById = async (req, res) => {
  try {
    const pool = getPool();
    const id = Number(req.params.id);

    if (!id) {
      return res.status(400).json({ message: "ID aparatur tidak valid." });
    }

    const [rows] = await pool.query(
      "SELECT * FROM aparatur WHERE id = ? LIMIT 1",
      [id]
    );

    if (!rows.length) {
      return res
        .status(404)
        .json({ message: "Data aparatur tidak ditemukan." });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error("Gagal mengambil data aparatur:", error);
    res.status(500).json({
      message: "Terjadi kesalahan saat mengambil data aparatur.",
    });
  }
};

/* =========================
   CREATE APARATUR
========================= */
export const createAparatur = async (req, res) => {
  try {
    const pool = getPool();
    const { nama, jabatan, wa, email, ig, fb, status } = req.body;

    if (!nama || !jabatan) {
      return res.status(400).json({
        message: "Nama dan jabatan wajib diisi.",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Foto aparatur wajib diupload.",
      });
    }

    const foto = req.file.path; // secure_url
    const fotoPublicId = req.file.filename; // public_id

    const [result] = await pool.query(
      `INSERT INTO aparatur 
      (nama, jabatan, wa, email, ig, fb, foto, foto_public_id, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        nama,
        jabatan,
        wa || null,
        email || null,
        ig || null,
        fb || null,
        foto,
        fotoPublicId,
        status || "active",
      ]
    );

    res.status(201).json({
      message: "Data aparatur berhasil ditambahkan.",
      id: result.insertId,
    });
  } catch (error) {
    console.error("Gagal menambahkan data aparatur:", error);
    res.status(500).json({
      message: "Terjadi kesalahan pada server.",
    });
  }
};

/* =========================
   UPDATE APARATUR
========================= */

export const updateAparatur = async (req, res) => {
  try {
    const pool = getPool();
    const id = Number(req.params.id);

    const { nama, jabatan, wa, email, ig, fb, status } = req.body;

    if (!nama || !jabatan) {
      return res.status(400).json({
        message: "Nama dan jabatan wajib diisi.",
      });
    }

    // Ambil data lama
    const [[old]] = await pool.query(
      "SELECT foto, foto_public_id FROM aparatur WHERE id = ?",
      [id]
    );

    if (!old) {
      return res
        .status(404)
        .json({ message: "Data aparatur tidak ditemukan." });
    }

    let foto = old.foto;
    let fotoPublicId = old.foto_public_id;

    // Jika upload foto baru
    if (req.file) {
      // hapus foto lama
      if (fotoPublicId) {
        await cloudinary.uploader.destroy(fotoPublicId);
      }

      foto = req.file.path;
      fotoPublicId = req.file.filename;
    }

    await pool.query(
      `UPDATE aparatur SET
        nama = ?, 
        jabatan = ?, 
        wa = ?, 
        email = ?, 
        ig = ?, 
        fb = ?, 
        foto = ?, 
        foto_public_id = ?, 
        status = ?, 
        updated_at = NOW()
       WHERE id = ?`,
      [
        nama,
        jabatan,
        wa || null,
        email || null,
        ig || null,
        fb || null,
        foto,
        fotoPublicId,
        status || "active",
        id,
      ]
    );

    res.json({ message: "Data aparatur berhasil diperbarui." });
  } catch (error) {
    console.error("Gagal memperbarui data aparatur:", error);
    res.status(500).json({
      message: "Terjadi kesalahan saat memperbarui data aparatur.",
    });
  }
};

/* =========================
   DELETE APARATUR
========================= */
export const deleteAparatur = async (req, res) => {
  try {
    const pool = getPool();
    const id = Number(req.params.id);

    const [[data]] = await pool.query(
      "SELECT foto_public_id FROM aparatur WHERE id = ?",
      [id]
    );

    if (!data) {
      return res
        .status(404)
        .json({ message: "Data aparatur tidak ditemukan." });
    }

    // hapus dari cloudinary
    if (data.foto_public_id) {
      await cloudinary.uploader.destroy(data.foto_public_id);
    }

    await pool.query("DELETE FROM aparatur WHERE id = ?", [id]);

    res.json({ message: "Data aparatur berhasil dihapus." });
  } catch (error) {
    console.error("Gagal menghapus data aparatur:", error);
    res.status(500).json({
      message: "Terjadi kesalahan saat menghapus data aparatur.",
    });
  }
};
