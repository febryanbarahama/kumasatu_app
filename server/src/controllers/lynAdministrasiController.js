import db from "../config/db.js";

/**
 * ENUM status yang diperbolehkan
 */
const ALLOWED_STATUS = ["menunggu", "diproses", "selesai", "ditolak"];

/**
 * =========================
 * GET semua permohonan
 * =========================
 */
export const getAllAdministrasi = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM lyn_administrasi ORDER BY id DESC"
    );
    res.status(200).json(rows);
  } catch (error) {
    console.error("❌ getAllAdministrasi:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};

/**
 * =========================
 * GET permohonan by ID
 * =========================
 */
export const getAdministrasiById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      "SELECT * FROM lyn_administrasi WHERE id = ? LIMIT 1",
      [id]
    );

    if (!rows.length) {
      return res
        .status(404)
        .json({ message: "Data administrasi tidak ditemukan" });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error("❌ getAdministrasiById:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};

/**
 * =========================
 * CREATE permohonan
 * (PUBLIC + UPLOAD CLOUDINARY)
 * =========================
 */
export const createAdministrasi = async (req, res) => {
  try {
    const {
      nik,
      nama,
      tempat_lahir,
      tanggal_lahir,
      jenis_kelamin,
      alamat,
      no_hp,
      email,
      jenis_layanan,
      keperluan,
    } = req.body;

    // =========================
    // VALIDASI
    // =========================
    if (!nik || !nama || !alamat || !jenis_layanan || !keperluan) {
      return res.status(400).json({
        message: "NIK, nama, alamat, jenis layanan, dan keperluan wajib diisi",
      });
    }

    // =========================
    // AMBIL FILE DARI CLOUDINARY
    // =========================
    const lampiran_ktp = req.files?.lampiran_ktp?.[0]?.path || null;

    const lampiran_kk = req.files?.lampiran_kk?.[0]?.path || null;

    const lampiran_lainnya = req.files?.lampiran_lainnya?.[0]?.path || null;

    // =========================
    // INSERT DATABASE
    // =========================
    const [result] = await db.query(
      `
      INSERT INTO lyn_administrasi (
        nik,
        nama,
        tempat_lahir,
        tanggal_lahir,
        jenis_kelamin,
        alamat,
        no_hp,
        email,
        jenis_layanan,
        keperluan,
        lampiran_ktp,
        lampiran_kk,
        lampiran_lainnya,
        status,
        created_at,
        updated_at
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'menunggu', NOW(), NOW()
      )
      `,
      [
        nik,
        nama,
        tempat_lahir || null,
        tanggal_lahir || null,
        jenis_kelamin || null,
        alamat,
        no_hp || null,
        email || null,
        jenis_layanan,
        keperluan,
        lampiran_ktp,
        lampiran_kk,
        lampiran_lainnya,
      ]
    );

    res.status(201).json({
      message: "Permohonan layanan administrasi berhasil dikirim",
      id: result.insertId,
    });
  } catch (error) {
    console.error("❌ createAdministrasi:", error);
    res.status(500).json({
      message: "Gagal menyimpan data administrasi",
    });
  }
};

/**
 * =========================
 * UPDATE status (ADMIN)
 * =========================
 */
export const updateAdministrasi = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status wajib diisi" });
    }

    if (!ALLOWED_STATUS.includes(status)) {
      return res.status(400).json({ message: "Status tidak valid" });
    }

    let query = "";
    let params = [];

    if (status === "selesai") {
      query = `
        UPDATE lyn_administrasi
        SET status = ?, tanggal_selesai = NOW(), updated_at = NOW()
        WHERE id = ?
      `;
      params = [status, id];
    } else {
      query = `
        UPDATE lyn_administrasi
        SET status = ?, updated_at = NOW()
        WHERE id = ?
      `;
      params = [status, id];
    }

    const [result] = await db.query(query, params);

    if (!result.affectedRows) {
      return res
        .status(404)
        .json({ message: "Data administrasi tidak ditemukan" });
    }

    res.json({ message: "Status administrasi berhasil diperbarui" });
  } catch (error) {
    console.error("❌ updateAdministrasi:", error);
    res.status(500).json({
      message: "Gagal memperbarui status administrasi",
    });
  }
};

/**
 * =========================
 * DELETE permohonan
 * =========================
 */
export const deleteAdministrasi = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      "DELETE FROM lyn_administrasi WHERE id = ?",
      [id]
    );

    if (!result.affectedRows) {
      return res
        .status(404)
        .json({ message: "Data administrasi tidak ditemukan" });
    }

    res.json({ message: "Data administrasi berhasil dihapus" });
  } catch (error) {
    console.error("❌ deleteAdministrasi:", error);
    res.status(500).json({
      message: "Gagal menghapus data administrasi",
    });
  }
};
