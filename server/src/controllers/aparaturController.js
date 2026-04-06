import getPool from "../config/db.js";

/* =========================
   GET ALL APARATUR
========================= */
export const getAllAparatur = async (req, res) => {
  try {
    const pool = getPool();

    const [rows] = await pool.query("SELECT * FROM aparatur ORDER BY id DESC");

    res.status(200).json(rows);
  } catch (error) {
    console.error("Gagal mengambil data aparatur:", error);
    res.status(500).json({
      message: "Terjadi kesalahan saat mengambil data aparatur.",
    });
  }
};

/* =========================
   GET BY ID
========================= */
export const getAparaturById = async (req, res) => {
  try {
    const pool = getPool();
    const id = Number(req.params.id);

    const [rows] = await pool.query(
      "SELECT * FROM aparatur WHERE id = ? LIMIT 1",
      [id],
    );

    if (!rows.length) {
      return res.status(404).json({
        message: "Data tidak ditemukan.",
      });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error("GET BY ID ERROR:", error);
    res.status(500).json({
      message: "Terjadi kesalahan server.",
    });
  }
};

/* =========================
   CREATE
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

    // ✅ WAJIB Cloudinary
    if (!req.file || !req.file.secure_url) {
      return res.status(400).json({
        message: "Upload foto gagal atau tidak ditemukan.",
      });
    }

    const foto = req.file.secure_url; // ✅ ONLY CLOUDINARY

    const [result] = await pool.query(
      `INSERT INTO aparatur 
      (nama, jabatan, wa, email, ig, fb, foto, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        nama,
        jabatan,
        wa || null,
        email || null,
        ig || null,
        fb || null,
        foto,
        status || "aktif",
      ],
    );

    res.status(201).json({
      message: "Data berhasil ditambahkan.",
      id: result.insertId,
    });
  } catch (error) {
    console.error("CREATE ERROR:", error);
    res.status(500).json({
      message: "Terjadi kesalahan server.",
    });
  }
};

/* =========================
   UPDATE
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

    const [rows] = await pool.query("SELECT foto FROM aparatur WHERE id = ?", [
      id,
    ]);

    if (!rows.length) {
      return res.status(404).json({
        message: "Data tidak ditemukan.",
      });
    }

    let foto = rows[0].foto;

    // ✅ kalau upload file baru (Cloudinary)
    if (req.file && req.file.secure_url) {
      foto = req.file.secure_url;
    }

    // ✅ kalau frontend kirim URL langsung
    else if (req.body.foto && req.body.foto.startsWith("http")) {
      foto = req.body.foto;
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
        status || "aktif",
        id,
      ],
    );

    res.json({
      message: "Data berhasil diperbarui.",
    });
  } catch (error) {
    console.error("UPDATE ERROR:", error);
    res.status(500).json({
      message: "Terjadi kesalahan saat update.",
    });
  }
};

/* =========================
   DELETE
========================= */
export const deleteAparatur = async (req, res) => {
  try {
    const pool = getPool();
    const id = Number(req.params.id);

    const [rows] = await pool.query("SELECT foto FROM aparatur WHERE id = ?", [
      id,
    ]);

    if (!rows.length) {
      return res.status(404).json({
        message: "Data tidak ditemukan.",
      });
    }

    // 🔥 OPTIONAL: kalau mau sekalian hapus di Cloudinary
    // (butuh public_id, nanti bisa kita tambahkan kalau kamu mau)

    await pool.query("DELETE FROM aparatur WHERE id = ?", [id]);

    res.json({
      message: "Data berhasil dihapus.",
    });
  } catch (error) {
    console.error("DELETE ERROR:", error);
    res.status(500).json({
      message: "Terjadi kesalahan saat delete.",
    });
  }
};
