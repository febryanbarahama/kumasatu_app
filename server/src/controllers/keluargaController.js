import db from "../config/db.js";
import { convertToWKTPoint } from "../utils/geoUtils.js";

// GET all keluarga
export const getAllKeluarga = (req, res) => {
  db.query("SELECT * FROM keluarga", (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(results);
  });
};

// GET keluarga by no_kk
export const getKeluargaByNoKK = (req, res) => {
  const { no_kk } = req.params;
  db.query(
    "SELECT * FROM keluarga WHERE no_kk = ?",
    [no_kk],
    (err, results) => {
      if (err) return res.status(500).json({ message: err.message });
      if (results.length === 0)
        return res
          .status(404)
          .json({ message: "Data keluarga tidak ditemukan" });
      res.json(results[0]);
    }
  );
};

// POST create keluarga
export const createKeluarga = (req, res) => {
  let data = { ...req.body };

  if (Array.isArray(data.aset)) {
    data.aset = data.aset.join(",");
  }
  if (Array.isArray(data.jenis_bantuan)) {
    data.jenis_bantuan = data.jenis_bantuan.join(",");
  }

  if (!data.no_kk || !data.nama_kk) {
    return res.status(400).json({ message: "no_kk dan nama_kk wajib diisi" });
  }

  const lokasiWkt = convertToWKTPoint(data.lokasi);
  delete data.lokasi;

  if (lokasiWkt) {
    const sql = "INSERT INTO keluarga SET ?, lokasi = ST_GeomFromText(?)";
    db.query(sql, [data, lokasiWkt], (err, results) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(400).json({ message: "No KK sudah terdaftar" });
        }
        return res.status(500).json({ message: err.message });
      }
      res.status(201).json({ message: "Data keluarga berhasil dibuat" });
    });
  } else {
    // Insert tanpa lokasi
    db.query("INSERT INTO keluarga SET ?", data, (err, results) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(400).json({ message: "No KK sudah terdaftar" });
        }
        return res.status(500).json({ message: err.message });
      }
      res.status(201).json({ message: "Data keluarga berhasil dibuat" });
    });
  }
};

// PUT update keluarga
export const updateKeluarga = (req, res) => {
  const { no_kk } = req.params;
  let data = { ...req.body };

  if (Array.isArray(data.aset)) {
    data.aset = data.aset.join(",");
  }
  if (Array.isArray(data.jenis_bantuan)) {
    data.jenis_bantuan = data.jenis_bantuan.join(",");
  }

  const lokasiWkt = convertToWKTPoint(data.lokasi);
  delete data.lokasi;

  let sql, params;
  if (lokasiWkt) {
    sql = "UPDATE keluarga SET ?, lokasi = ST_GeomFromText(?) WHERE no_kk = ?";
    params = [data, lokasiWkt, no_kk];
  } else {
    sql = "UPDATE keluarga SET ? WHERE no_kk = ?";
    params = [data, no_kk];
  }

  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    if (results.affectedRows === 0)
      return res.status(404).json({ message: "Data keluarga tidak ditemukan" });
    res.json({ message: "Data keluarga berhasil diupdate" });
  });
};

// DELETE keluarga
export const deleteKeluarga = (req, res) => {
  const { no_kk } = req.params;
  db.query("DELETE FROM keluarga WHERE no_kk = ?", [no_kk], (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    if (results.affectedRows === 0)
      return res.status(404).json({ message: "Data keluarga tidak ditemukan" });
    res.json({ message: "Data keluarga berhasil dihapus" });
  });
};
