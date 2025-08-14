// src/controllers/keluargaController.js
import db from "../config/db.js";
import XLSX from "xlsx";
import fs from "fs";

// Helper untuk buat WKT Point dari koordinat
function createWKTPoint(lokasi) {
  if (!lokasi || lokasi.x == null || lokasi.y == null) return null;
  return `POINT(${lokasi.x} ${lokasi.y})`;
}

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

  if (Array.isArray(data.aset)) data.aset = data.aset.join(",");
  if (Array.isArray(data.jenis_bantuan))
    data.jenis_bantuan = data.jenis_bantuan.join(",");

  if (!data.no_kk || !data.nama_kk) {
    return res.status(400).json({ message: "no_kk dan nama_kk wajib diisi" });
  }

  const lokasiWkt = createWKTPoint(data.lokasi);
  delete data.lokasi;

  if (lokasiWkt) {
    const sql = "INSERT INTO keluarga SET ?, lokasi = ST_GeomFromText(?)";
    db.query(sql, [data, lokasiWkt], (err) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(400).json({ message: "No KK sudah terdaftar" });
        }
        return res.status(500).json({ message: err.message });
      }
      res.status(201).json({ message: "Data keluarga berhasil dibuat" });
    });
  } else {
    db.query("INSERT INTO keluarga SET ?", data, (err) => {
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

  if (Array.isArray(data.aset)) data.aset = data.aset.join(",");
  if (Array.isArray(data.jenis_bantuan))
    data.jenis_bantuan = data.jenis_bantuan.join(",");

  const lokasiWkt = createWKTPoint(data.lokasi);
  delete data.lokasi;

  if (lokasiWkt) {
    const sql =
      "UPDATE keluarga SET ?, lokasi = ST_GeomFromText(?) WHERE no_kk = ?";
    db.query(sql, [data, lokasiWkt, no_kk], (err, results) => {
      if (err) return res.status(500).json({ message: err.message });
      if (results.affectedRows === 0)
        return res
          .status(404)
          .json({ message: "Data keluarga tidak ditemukan" });
      res.json({ message: "Data keluarga berhasil diupdate" });
    });
  } else {
    db.query(
      "UPDATE keluarga SET ? WHERE no_kk = ?",
      [data, no_kk],
      (err, results) => {
        if (err) return res.status(500).json({ message: err.message });
        if (results.affectedRows === 0)
          return res
            .status(404)
            .json({ message: "Data keluarga tidak ditemukan" });
        res.json({ message: "Data keluarga berhasil diupdate" });
      }
    );
  }
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

// IMPORT Excel keluarga
export const importKeluarga = (req, res) => {
  console.log("📥 Mulai proses import Excel...");

  if (!req.file) {
    console.error("❌ Tidak ada file yang diupload");
    return res.status(400).json({ message: "File tidak ditemukan" });
  }

  try {
    console.log("📄 File diterima:", req.file.originalname);
    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    console.log("📑 Sheet terdeteksi:", sheetName);

    const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
    console.log(`📊 Jumlah baris yang terbaca: ${sheetData.length}`);
    console.log("🔍 Contoh data:", sheetData[0]);

    if (!sheetData.length) {
      return res
        .status(400)
        .json({ message: "File Excel kosong atau format salah" });
    }

    sheetData.forEach((row) => {
      // Mapping kolom
      const lokasi = row.lokasi || { x: row.lokasi_x, y: row.lokasi_y };
      const lokasiWkt = createWKTPoint(lokasi);

      const dataDb = {
        no_kk: row.no_kk?.toString().padStart(16, "0") || null,
        nama_kk: row.nama_kk || null,
        nik_kk: row.nik_kk?.toString().padStart(16, "0") || null,
        jenis_kelamin_kk:
          row.jenis_kelamin_kk?.toLowerCase() === "laki-laki"
            ? "laki-laki"
            : row.jenis_kelamin_kk?.toLowerCase() === "perempuan"
            ? "perempuan"
            : null,
        lindongan: row.lindongan || null,
        jumlah_art: Number(row.jumlah_art) || 0,
        status_bangunan: row.status_bangunan || null,
        status_kepemilikan_tanah: row.status_kepemilikan_tanah || null,
        luas_bangunan: Number(row.luas_bangunan) || 0,
        luas_tanah: Number(row.luas_tanah) || 0,
        jenis_lantai: row.jenis_lantai || null,
        jenis_dinding: row.jenis_dinding || null,
        jenis_atap: row.jenis_atap || null,
        fasilitas_mck: row.fasilitas_mck || null,
        tempat_pembuangan_tinja: row.tempat_pembuangan_tinja || null,
        sumber_air_minum: row.sumber_air_minum || null,
        sumber_air_mandi: row.sumber_air_mandi || null,
        sumber_penerangan: row.sumber_penerangan || null,
        daya_listrik: row.daya_listrik || null,
        bahan_bakar_memasak: row.bahan_bakar_memasak || null,
        aset: row.aset || null,
        tanah_lain: row.tanah_lain || null,
        penerima_bantuan: row.penerima_bantuan || null,
        jenis_bantuan: row.jenis_bantuan || null,
      };

      if (lokasiWkt) {
        db.query(
          "INSERT INTO keluarga SET ?, lokasi = ST_GeomFromText(?)",
          [dataDb, lokasiWkt],
          (err) => {
            if (err)
              console.error(`❌ Gagal insert row ${row.no_kk}:`, err.message);
          }
        );
      } else {
        db.query("INSERT INTO keluarga SET ?", dataDb, (err) => {
          if (err)
            console.error(`❌ Gagal insert row ${row.no_kk}:`, err.message);
        });
      }
    });

    fs.unlinkSync(req.file.path);
    res.json({ message: "Import selesai diproses" });
  } catch (error) {
    console.error("❌ Error saat membaca file:", error);
    res
      .status(500)
      .json({ message: "Gagal import data", error: error.message });
  }
};
