// server/src/controllers/dashboardController.js
import getPool from "../config/db.js";

export const getDashboardData = async (req, res) => {
  try {
    const pool = getPool();

    // Total Penduduk
    const [[totalPenduduk]] = await pool.query(
      "SELECT COUNT(*) AS total FROM individu"
    );

    // Total Keluarga
    const [[totalKeluarga]] = await pool.query(
      "SELECT COUNT(*) AS total FROM keluarga"
    );

    // Jenis Kelamin
    const [gender] = await pool.query(`
      SELECT jenis_kelamin, COUNT(*) AS total
      FROM individu
      GROUP BY jenis_kelamin
    `);

    // Per Lindongan
    const [perLindongan] = await pool.query(`
      SELECT lindongan, COUNT(*) AS total
      FROM individu
      GROUP BY lindongan
    `);

    // Kelompok Usia
    const [usia] = await pool.query(`
      SELECT 
        CASE 
          WHEN usia BETWEEN 0 AND 14 THEN 'Anak-anak (0-14)'
          WHEN usia BETWEEN 15 AND 64 THEN 'Produktif (15-64)'
          ELSE 'Lansia (65+)' 
        END AS kelompok_usia,
        jenis_kelamin,
        COUNT(*) AS total
      FROM individu
      GROUP BY kelompok_usia, jenis_kelamin
    `);

    // Pendidikan
    const [pendidikan] = await pool.query(`
      SELECT ijazah AS pendidikan, COUNT(*) AS total
      FROM individu
      GROUP BY ijazah
    `);

    // Pekerjaan
    const [pekerjaan] = await pool.query(`
      SELECT pekerjaan_utama, COUNT(*) AS total
      FROM individu
      WHERE pekerjaan_utama IS NOT NULL
      GROUP BY pekerjaan_utama
    `);

    // Agama
    const [agama] = await pool.query(`
      SELECT agama, COUNT(*) AS total
      FROM individu
      GROUP BY agama
    `);

    // Status Bangunan
    const [statusBangunan] = await pool.query(`
      SELECT status_bangunan, COUNT(*) AS total
      FROM keluarga
      GROUP BY status_bangunan
    `);

    // Sumber Air Mandi
    const [sumberAirMandi] = await pool.query(`
      SELECT sumber_air_mandi, COUNT(*) AS total
      FROM keluarga
      GROUP BY sumber_air_mandi
    `);

    // Bantuan Sosial
    const [bantuan] = await pool.query(`
      SELECT jenis_bantuan, COUNT(*) AS total
      FROM keluarga
      GROUP BY jenis_bantuan
    `);

    // Status Pernikahan
    const [statusNikah] = await pool.query(`
      SELECT status_pernikahan, COUNT(*) AS total
      FROM individu
      GROUP BY status_pernikahan
    `);

    // Kepemilikan Ijazah
    const [kepemilikanIjazah] = await pool.query(`
      SELECT ijazah, COUNT(*) AS total
      FROM individu
      WHERE ijazah <> 'Tidak/belum bersekolah'
      GROUP BY ijazah
    `);

    res.json({
      totalPenduduk: totalPenduduk.total,
      totalKeluarga: totalKeluarga.total,
      gender,
      perLindongan,
      usia,
      pendidikan,
      pekerjaan,
      agama,
      statusBangunan,
      sumberAirMandi,
      bantuan,
      statusNikah,
      kepemilikanIjazah,
    });
  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({ message: "Gagal memuat data dashboard" });
  }
};
