import db from "../config/db.js";
import XLSX from "xlsx";

/* =======================
   Helper WKT POINT
======================= */
function createWKTPoint(lokasi) {
  if (!lokasi || lokasi.x == null || lokasi.y == null) return null;
  return `POINT(${lokasi.x} ${lokasi.y})`;
}

/* =======================
   Helper normalize comma field
======================= */
const normalizeCommaField = (value) => {
  if (!value) return null;
  if (Array.isArray(value)) return value.join(",");
  return String(value)
    .split(",")
    .map((v) => v.trim())
    .join(",");
};

/* =======================
   GET ALL
======================= */
export const getAllKeluarga = async (_, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM keluarga");
    return res.json(rows);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/* =======================
   GET BY NO_KK
======================= */
export const getKeluargaByNoKK = async (req, res) => {
  try {
    const { no_kk } = req.params;

    const [rows] = await db.query("SELECT * FROM keluarga WHERE no_kk = ?", [
      no_kk,
    ]);

    if (!rows.length) {
      return res.status(404).json({
        message: "Data keluarga tidak ditemukan",
      });
    }

    return res.json(rows[0]);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/* =======================
   CREATE
======================= */
export const createKeluarga = async (req, res) => {
  try {
    let data = { ...req.body };

    if (!data.no_kk || !data.nama_kk) {
      return res.status(400).json({
        message: "no_kk dan nama_kk wajib diisi",
      });
    }

    data.aset = normalizeCommaField(data.aset);
    data.jenis_bantuan = normalizeCommaField(data.jenis_bantuan);

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

    return res.status(201).json({
      message: "Data keluarga berhasil dibuat",
    });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({
        message: "No KK sudah terdaftar",
      });
    }
    return res.status(500).json({ message: err.message });
  }
};

/* =======================
   UPDATE
======================= */
export const updateKeluarga = async (req, res) => {
  try {
    const { no_kk } = req.params;
    let data = { ...req.body };

    data.aset = normalizeCommaField(data.aset);
    data.jenis_bantuan = normalizeCommaField(data.jenis_bantuan);

    const lokasiWkt = createWKTPoint(data.lokasi);
    delete data.lokasi;

    let result;
    if (lokasiWkt) {
      [result] = await db.query(
        "UPDATE keluarga SET ?, lokasi = ST_GeomFromText(?) WHERE no_kk = ?",
        [data, lokasiWkt, no_kk]
      );
    } else {
      [result] = await db.query("UPDATE keluarga SET ? WHERE no_kk = ?", [
        data,
        no_kk,
      ]);
    }

    if (!result.affectedRows) {
      return res.status(404).json({
        message: "Data keluarga tidak ditemukan",
      });
    }

    return res.json({
      message: "Data keluarga berhasil diupdate",
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/* =======================
   DELETE
======================= */
export const deleteKeluarga = async (req, res) => {
  try {
    const { no_kk } = req.params;

    const [result] = await db.query("DELETE FROM keluarga WHERE no_kk = ?", [
      no_kk,
    ]);

    if (!result.affectedRows) {
      return res.status(404).json({
        message: "Data keluarga tidak ditemukan",
      });
    }

    return res.json({
      message: "Data keluarga berhasil dihapus",
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/* =======================
   IMPORT EXCEL
======================= */
export const importKeluarga = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "File Excel wajib diunggah",
      });
    }

    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: null });

    if (!rows.length) {
      return res.status(400).json({
        message: "File Excel kosong",
      });
    }

    let success = 0;
    let failed = [];

    for (let i = 0; i < rows.length; i++) {
      const r = rows[i];

      if (!r.no_kk || !r.nama_kk) {
        failed.push({
          row: i + 2,
          reason: "no_kk atau nama_kk kosong",
        });
        continue;
      }

      const data = {
        no_kk: String(r.no_kk),
        nama_kk: r.nama_kk,
        nik_kk: r.nik_kk || null,
        jenis_kelamin_kk: r.jenis_kelamin_kk || null,
        lindongan: r.lindongan || null,
        jumlah_art: r.jumlah_art || null,
        status_bangunan: r.status_bangunan || null,
        status_kepemilikan_tanah: r.status_kepemilikan_tanah || null,
        luas_bangunan: r.luas_bangunan || null,
        luas_tanah: r.luas_tanah || null,
        jenis_lantai: r.jenis_lantai || null,
        jenis_dinding: r.jenis_dinding || null,
        jenis_atap: r.jenis_atap || null,
        fasilitas_mck: r.fasilitas_mck || null,
        tempat_pembuangan_tinja: r.tempat_pembuangan_tinja || null,
        sumber_air_minum: r.sumber_air_minum || null,
        sumber_air_mandi: r.sumber_air_mandi || null,
        sumber_penerangan: r.sumber_penerangan || null,
        daya_listrik: r.daya_listrik || null,
        bahan_bakar_memasak: r.bahan_bakar_memasak || null,
        aset: normalizeCommaField(r.aset),
        tanah_lain: r.tanah_lain || null,
        penerima_bantuan: r.penerima_bantuan || null,
        jenis_bantuan: normalizeCommaField(r.jenis_bantuan),
      };

      const lokasi =
        r.lokasi_x != null && r.lokasi_y != null
          ? `POINT(${r.lokasi_x} ${r.lokasi_y})`
          : null;

      try {
        if (lokasi) {
          await db.query(
            "INSERT INTO keluarga SET ?, lokasi = ST_GeomFromText(?)",
            [data, lokasi]
          );
        } else {
          await db.query("INSERT INTO keluarga SET ?", [data]);
        }
        success++;
      } catch (err) {
        failed.push({
          row: i + 2,
          no_kk: r.no_kk,
          reason:
            err.code === "ER_DUP_ENTRY" ? "No KK sudah terdaftar" : err.message,
        });
      }
    }

    return res.json({
      message: "Import data keluarga selesai",
      total: rows.length,
      success,
      failed_count: failed.length,
      failed,
    });
  } catch (error) {
    console.error("❌ importKeluarga:", error);
    return res.status(500).json({
      message: "Gagal mengimpor data keluarga",
    });
  }
};
