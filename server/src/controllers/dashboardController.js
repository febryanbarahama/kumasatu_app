// controllers/dashboardController.js
import db from "../config/db.js"; // sudah pakai pool dari mysql2/promise

export const getDashboardData = async (req, res) => {
  try {
    // 1. Total keluarga
    const [[keluargaCount]] = await db.query(
      `SELECT COUNT(*) AS total FROM keluarga`
    );

    // 2. Total individu
    const [[pendudukCount]] = await db.query(
      `SELECT COUNT(*) AS total FROM individu`
    );

    // 3. Distribusi gender
    const [genderStat] = await db.query(`
      SELECT jenis_kelamin AS gender, COUNT(*) AS total
      FROM individu
      GROUP BY jenis_kelamin
    `);

    // 4. Chart pertumbuhan penduduk per tahun (contoh berdasarkan data tahun lahir)
    const [chartPenduduk] = await db.query(`
      SELECT YEAR(tanggal_lahir) AS tahun, COUNT(*) AS jumlah
      FROM individu
      GROUP BY YEAR(tanggal_lahir)
      ORDER BY tahun ASC
    `);

    // 5. Chart bantuan berdasarkan status_bangunan (contoh)
    const [bantuanChart] = await db.query(`
      SELECT status_bangunan AS jenis, COUNT(*) AS jumlah
      FROM keluarga
      GROUP BY status_bangunan
    `);

    res.json({
      stats: {
        totalKeluarga: keluargaCount.total,
        totalIndividu: pendudukCount.total,
        laki: genderStat.find((g) => g.gender === "laki-laki")?.total || 0,
        perempuan: genderStat.find((g) => g.gender === "perempuan")?.total || 0,
      },
      chartPenduduk: chartPenduduk.map((row) => ({
        tahun: row.tahun,
        jumlah: row.jumlah,
      })),
      bantuanChart: bantuanChart.map((row) => ({
        jenis: row.jenis,
        jumlah: row.jumlah,
      })),
    });
  } catch (err) {
    console.error("Error Dashboard:", err);
    res.status(500).json({ message: "Gagal mengambil data dashboard" });
  }
};
