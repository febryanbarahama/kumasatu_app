import db from "../config/db.js";

/**
 * ENUM status yang diperbolehkan
 */
const ALLOWED_STATUS = ["menunggu", "diproses", "selesai", "ditolak"];

/**
 * =========================
 * GET semua pengaduan
 * =========================
 */
export const getAllPengaduan = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM lyn_pengaduan ORDER BY id DESC"
    );
    return res.status(200).json(rows);
  } catch (error) {
    console.error("❌ getAllPengaduan:", error);
    return res.status(500).json({
      message: "Terjadi kesalahan pada server",
    });
  }
};

/**
 * =========================
 * GET pengaduan by ID
 * =========================
 */
export const getPengaduanById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      "SELECT * FROM lyn_pengaduan WHERE id = ? LIMIT 1",
      [id]
    );

    if (!rows.length) {
      return res.status(404).json({
        message: "Data pengaduan tidak ditemukan",
      });
    }

    return res.status(200).json(rows[0]);
  } catch (error) {
    console.error("❌ getPengaduanById:", error);
    return res.status(500).json({
      message: "Terjadi kesalahan pada server",
    });
  }
};

/**
 * =========================
 * CREATE pengaduan
 * (public API)
 * =========================
 */
export const createPengaduan = async (req, res) => {
  try {
    const { nik, nama, alamat, no_hp, email, judul_pengaduan, isi_pengaduan } =
      req.body;

    // =========================
    // VALIDASI
    // =========================
    if (!nik || !nama || !alamat || !judul_pengaduan || !isi_pengaduan) {
      return res.status(400).json({
        message:
          "NIK, nama, alamat, judul pengaduan, dan isi pengaduan wajib diisi",
      });
    }

    // =========================
    // AMBIL FILE DARI CLOUDINARY
    // =========================
    const lampiran = {
      foto: req.files?.lampiran_foto?.map((file) => file.path) || [],
      video: req.files?.lampiran_video?.[0]?.path || null,
      lainnya: req.files?.lampiran_lainnya?.map((file) => file.path) || [],
    };

    // =========================
    // INSERT DB
    // =========================
    const [result] = await db.query(
      `
      INSERT INTO lyn_pengaduan (
        nik,
        nama,
        alamat,
        no_hp,
        email,
        judul_pengaduan,
        isi_pengaduan,
        lampiran,
        status,
        created_at,
        updated_at
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, 'menunggu', NOW(), NOW()
      )
      `,
      [
        nik,
        nama,
        alamat,
        no_hp || null,
        email || null,
        judul_pengaduan,
        isi_pengaduan,
        JSON.stringify(lampiran),
      ]
    );

    return res.status(201).json({
      message: "Pengaduan berhasil dikirim",
      id: result.insertId,
    });
  } catch (error) {
    console.error("❌ createPengaduan:", error);
    return res.status(500).json({
      message: "Gagal mengirim pengaduan",
    });
  }
};

/**
 * =========================
 * UPDATE status (ADMIN)
 * =========================
 */
export const updatePengaduan = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        message: "Status wajib diisi",
      });
    }

    if (!ALLOWED_STATUS.includes(status)) {
      return res.status(400).json({
        message: "Status tidak valid",
      });
    }

    let query;
    let params;

    if (status === "selesai") {
      query = `
        UPDATE lyn_pengaduan
        SET status = ?, tanggal_selesai = NOW(), updated_at = NOW()
        WHERE id = ?
      `;
      params = [status, id];
    } else {
      query = `
        UPDATE lyn_pengaduan
        SET status = ?, tanggal_selesai = NULL, updated_at = NOW()
        WHERE id = ?
      `;
      params = [status, id];
    }

    const [result] = await db.query(query, params);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Data pengaduan tidak ditemukan",
      });
    }

    return res.status(200).json({
      message: "Status pengaduan berhasil diperbarui",
    });
  } catch (error) {
    console.error("❌ updatePengaduan:", error);
    return res.status(500).json({
      message: "Gagal memperbarui status pengaduan",
    });
  }
};

/**
 * =========================
 * DELETE pengaduan
 * =========================
 */
export const deletePengaduan = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query("DELETE FROM lyn_pengaduan WHERE id = ?", [
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Data pengaduan tidak ditemukan",
      });
    }

    return res.status(200).json({
      message: "Data pengaduan berhasil dihapus",
    });
  } catch (error) {
    console.error("❌ deletePengaduan:", error);
    return res.status(500).json({
      message: "Gagal menghapus data pengaduan",
    });
  }
};
