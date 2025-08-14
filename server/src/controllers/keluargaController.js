// src/controllers/keluargaController.js
import db from "../config/db.js";
import XLSX from "xlsx";
import fs from "fs";

// Helper buat WKT Point
function createWKTPoint(lokasi) {
  if (!lokasi || lokasi.x == null || lokasi.y == null) return null;
  return `POINT(${lokasi.x} ${lokasi.y})`;
}

// =======================
// GET all keluarga
// =======================
export const getAllKeluarga = async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM keluarga");
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =======================
// GET keluarga by no_kk
// =======================
export const getKeluargaByNoKK = async (req, res) => {
  try {
    const { no_kk } = req.params;
    const [results] = await db.query("SELECT * FROM keluarga WHERE no_kk = ?", [
      no_kk,
    ]);

    if (results.length === 0) {
      return res.status(404).json({ message: "Data keluarga tidak ditemukan" });
    }
    res.json(results[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =======================
// POST create keluarga
// =======================
export const createKeluarga = async (req, res) => {
  try {
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
      await db.query(
        "INSERT INTO keluarga SET ?, lokasi = ST_GeomFromText(?)",
        [data, lokasiWkt]
      );
    } else {
      await db.query("INSERT INTO keluarga SET ?", [data]);
    }

    res.status(201).json({ message: "Data keluarga berhasil dibuat" });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ message: "No KK sudah terdaftar" });
    }
    res.status(500).json({ message: err.message });
  }
};

// =======================
// PUT update keluarga
// =======================
export const updateKeluarga = async (req, res) => {
  try {
    const { no_kk } = req.params;
    let data = { ...req.body };

    if (Array.isArray(data.aset)) data.aset = data.aset.join(",");
    if (Array.isArray(data.jenis_bantuan))
      data.jenis_bantuan = data.jenis_bantuan.join(",");

    const lokasiWkt = createWKTPoint(data.lokasi);
    delete data.lokasi;

    let results;
    if (lokasiWkt) {
      [results] = await db.query(
        "UPDATE keluarga SET ?, lokasi = ST_GeomFromText(?) WHERE no_kk = ?",
        [data, lokasiWkt, no_kk]
      );
    } else {
      [results] = await db.query("UPDATE keluarga SET ? WHERE no_kk = ?", [
        data,
        no_kk,
      ]);
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Data keluarga tidak ditemukan" });
    }

    res.json({ message: "Data keluarga berhasil diupdate" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =======================
// DELETE keluarga
// =======================
export const deleteKeluarga = async (req, res) => {
  try {
    const { no_kk } = req.params;
    const [results] = await db.query("DELETE FROM keluarga WHERE no_kk = ?", [
      no_kk,
    ]);

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Data keluarga tidak ditemukan" });
    }

    res.json({ message: "Data keluarga berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =======================
// ENUM & SET mapping
// =======================
const enumMappingKeluarga = {
  /* ... mapping sama seperti versi lama ... */
};
const setMappingKeluarga = {
  /* ... mapping sama seperti versi lama ... */
};

// Normalisasi ENUM dan SET
function normalizeEnum(value, mapping, defaultValue = null) {
  if (!value) return defaultValue;
  const val = value.toString().trim().toLowerCase();
  return mapping[val] || defaultValue;
}

function normalizeSet(value, allowedValues) {
  if (!value) return null;
  const values = value
    .toString()
    .split(",")
    .map((v) => v.trim())
    .filter((v) => allowedValues.includes(v));
  return values.join(",");
}

// =======================
// IMPORT keluarga
// =======================
export const importKeluarga = async (req, res) => {
  console.log("📥 Mulai proses import Excel keluarga...");

  if (!req.file) {
    return res.status(400).json({ message: "File tidak ditemukan" });
  }

  const failedRows = [];

  try {
    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    if (!sheetData.length) {
      return res
        .status(400)
        .json({ message: "File Excel kosong atau format salah" });
    }

    let processed = 0;

    for (let index = 0; index < sheetData.length; index++) {
      let row = sheetData[index];

      // Normalisasi ENUM
      for (const field in enumMappingKeluarga) {
        if (row[field] !== undefined) {
          row[field] = normalizeEnum(
            row[field],
            enumMappingKeluarga[field],
            Object.values(enumMappingKeluarga[field])[0]
          );
        }
      }

      // Normalisasi SET
      for (const field in setMappingKeluarga) {
        if (row[field] !== undefined) {
          row[field] = normalizeSet(row[field], setMappingKeluarga[field]);
        }
      }

      // Siapkan data insert
      const dataDb = {
        no_kk: row.no_kk?.toString().padStart(16, "0") || null,
        nama_kk: row.nama_kk || null,
        nik_kk: row.nik_kk?.toString().padStart(16, "0") || null,
        jenis_kelamin_kk: row.jenis_kelamin_kk || "laki-laki",
        lindongan: row.lindongan || "Lindongan 1",
        jumlah_art: row.jumlah_art || 0,
        status_bangunan: row.status_bangunan || "Milik Sendiri",
        status_kepemilikan_tanah:
          row.status_kepemilikan_tanah || "Tidak memiliki",
        luas_bangunan: row.luas_bangunan || 0,
        luas_tanah: row.luas_tanah || 0,
        jenis_lantai: row.jenis_lantai || "Semen",
        jenis_dinding: row.jenis_dinding || "Tembok",
        jenis_atap: row.jenis_atap || "Seng",
        fasilitas_mck: row.fasilitas_mck || "Tidak ada fasilitas",
        tempat_pembuangan_tinja: row.tempat_pembuangan_tinja || "Lainnya",
        sumber_air_minum: row.sumber_air_minum || "Sumur",
        sumber_air_mandi: row.sumber_air_mandi || "Sumur",
        sumber_penerangan: row.sumber_penerangan || "Listrik PLN",
        daya_listrik: row.daya_listrik || null,
        bahan_bakar_memasak: row.bahan_bakar_memasak || "Kayu bakar",
        aset: row.aset || null,
        tanah_lain: row.tanah_lain || "Tidak ada",
        penerima_bantuan: row.penerima_bantuan || "Tidak",
        jenis_bantuan: row.jenis_bantuan || null,
      };

      try {
        await db.query("INSERT INTO keluarga SET ?", [dataDb]);
        processed++;
      } catch (err) {
        let customMsg = err.message;
        if (err.code === "ER_DUP_ENTRY") {
          customMsg = "Data dengan No KK ini sudah ada";
        }
        failedRows.push({
          row_number: index + 2,
          no_kk: row.no_kk,
          error_message: customMsg,
          data: row,
        });
      }
    }

    fs.unlinkSync(req.file.path);

    if (failedRows.length) {
      const failPath = "./import_gagal_keluarga.json";
      fs.writeFileSync(failPath, JSON.stringify(failedRows, null, 2));
    }

    res.json({
      message: "Proses import selesai",
      sukses: processed,
      gagal: failedRows.length,
      file_gagal: failedRows.length ? "import_gagal_keluarga.json" : null,
    });
  } catch (error) {
    console.error("❌ Error saat membaca file:", error);
    res
      .status(500)
      .json({ message: "Gagal import data", error: error.message });
  }
};
