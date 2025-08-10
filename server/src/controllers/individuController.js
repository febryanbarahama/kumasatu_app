import db from "../config/db.js";

// Helper: convert SET fields dari string ke array dan sebaliknya
const parseSetField = (field) => (field ? field.split(",") : []);
const joinSetField = (field) => (Array.isArray(field) ? field.join(",") : "");

// CREATE individu
export const createIndividu = (req, res) => {
  const data = { ...req.body };
  const no_kk = data.no_kk;

  // Cek apakah no_kk ada di keluarga
  db.query(
    "SELECT no_kk FROM keluarga WHERE no_kk = ?",
    [no_kk],
    (err, results) => {
      if (err) return res.status(500).json({ message: err.message });
      if (results.length === 0) {
        return res.status(400).json({
          message: `Nomor KK ${no_kk} tidak ditemukan. Penduduk belum terdaftar dalam keluarga.`,
        });
      }

      // lanjut proses insert individu jika KK valid
      data.jaminan_kesehatan = joinSetField(data.jaminan_kesehatan);
      data.disabilitas = joinSetField(data.disabilitas);
      data.penyakit = joinSetField(data.penyakit);
      data.tempat_rawat_jalan = joinSetField(data.tempat_rawat_jalan);
      data.tempat_rawat_inap = joinSetField(data.tempat_rawat_inap);

      const sql = "INSERT INTO individu SET ?";
      db.query(sql, data, (err2, results2) => {
        if (err2) {
          if (err2.code === "ER_DUP_ENTRY") {
            return res.status(400).json({ message: "NIK sudah terdaftar" });
          }
          return res.status(500).json({ message: err2.message });
        }
        res.status(201).json({ message: "Data individu berhasil dibuat" });
      });
    }
  );
};

// READ semua individu
export const getAllIndividu = (req, res) => {
  const sql = "SELECT * FROM individu";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: err.message });

    // Parse SET fields jadi array
    const parsed = results.map((row) => ({
      ...row,
      jaminan_kesehatan: parseSetField(row.jaminan_kesehatan),
      disabilitas: parseSetField(row.disabilitas),
      penyakit: parseSetField(row.penyakit),
      tempat_rawat_jalan: parseSetField(row.tempat_rawat_jalan),
      tempat_rawat_inap: parseSetField(row.tempat_rawat_inap),
    }));

    res.json(parsed);
  });
};

// READ individu by NIK
export const getIndividuByNik = (req, res) => {
  const { nik } = req.params;
  const sql = "SELECT * FROM individu WHERE nik = ?";
  db.query(sql, [nik], (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    if (results.length === 0)
      return res.status(404).json({ message: "Data individu tidak ditemukan" });

    const row = results[0];
    row.jaminan_kesehatan = parseSetField(row.jaminan_kesehatan);
    row.disabilitas = parseSetField(row.disabilitas);
    row.penyakit = parseSetField(row.penyakit);
    row.tempat_rawat_jalan = parseSetField(row.tempat_rawat_jalan);
    row.tempat_rawat_inap = parseSetField(row.tempat_rawat_inap);

    res.json(row);
  });
};

// UPDATE individu by NIK
export const updateIndividu = (req, res) => {
  const { nik } = req.params;
  let data = { ...req.body };

  data.jaminan_kesehatan = joinSetField(data.jaminan_kesehatan);
  data.disabilitas = joinSetField(data.disabilitas);
  data.penyakit = joinSetField(data.penyakit);
  data.tempat_rawat_jalan = joinSetField(data.tempat_rawat_jalan);
  data.tempat_rawat_inap = joinSetField(data.tempat_rawat_inap);

  const sql = "UPDATE individu SET ? WHERE nik = ?";
  db.query(sql, [data, nik], (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    if (results.affectedRows === 0)
      return res.status(404).json({ message: "Data individu tidak ditemukan" });

    res.json({ message: "Data individu berhasil diupdate" });
  });
};

// DELETE individu by NIK
export const deleteIndividu = (req, res) => {
  const { nik } = req.params;
  const sql = "DELETE FROM individu WHERE nik = ?";
  db.query(sql, [nik], (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    if (results.affectedRows === 0)
      return res.status(404).json({ message: "Data individu tidak ditemukan" });

    res.json({ message: "Data individu berhasil dihapus" });
  });
};
