import db from "../config/db.js";
import XLSX from "xlsx";

/* =======================
   Helper: SET <-> Array
======================= */
const parseSetField = (field) => (field ? field.split(",") : []);

const joinSetField = (field) => {
  if (Array.isArray(field)) return field.join(",");
  if (typeof field === "string" && field.trim() !== "") {
    return field
      .split(",")
      .map((i) => i.trim())
      .join(",");
  }
  return "";
};

/* =======================
   CREATE (MANUAL)
======================= */
export const createIndividu = async (req, res) => {
  try {
    const data = { ...req.body };

    const [kk] = await db.query("SELECT no_kk FROM keluarga WHERE no_kk = ?", [
      data.no_kk,
    ]);

    if (!kk.length) {
      return res
        .status(400)
        .json({ message: `Nomor KK ${data.no_kk} tidak ditemukan` });
    }

    data.jaminan_kesehatan = joinSetField(data.jaminan_kesehatan);
    data.disabilitas = joinSetField(data.disabilitas);
    data.penyakit = joinSetField(data.penyakit);
    data.tempat_rawat_jalan = joinSetField(data.tempat_rawat_jalan);
    data.tempat_rawat_inap = joinSetField(data.tempat_rawat_inap);

    await db.query("INSERT INTO individu SET ?", [data]);

    return res.status(201).json({
      message: "Data individu berhasil dibuat",
    });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ message: "NIK sudah terdaftar" });
    }
    return res.status(500).json({ message: err.message });
  }
};

/* =======================
   READ ALL
======================= */
export const getAllIndividu = async (_, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM individu");

    const parsed = rows.map((row) => ({
      ...row,
      jaminan_kesehatan: parseSetField(row.jaminan_kesehatan),
      disabilitas: parseSetField(row.disabilitas),
      penyakit: parseSetField(row.penyakit),
      tempat_rawat_jalan: parseSetField(row.tempat_rawat_jalan),
      tempat_rawat_inap: parseSetField(row.tempat_rawat_inap),
    }));

    return res.json(parsed);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/* =======================
   READ BY NIK
======================= */
export const getIndividuByNik = async (req, res) => {
  try {
    const { nik } = req.params;

    const [rows] = await db.query("SELECT * FROM individu WHERE nik = ?", [
      nik,
    ]);

    if (!rows.length) {
      return res.status(404).json({
        message: "Data individu tidak ditemukan",
      });
    }

    const row = rows[0];
    row.jaminan_kesehatan = parseSetField(row.jaminan_kesehatan);
    row.disabilitas = parseSetField(row.disabilitas);
    row.penyakit = parseSetField(row.penyakit);
    row.tempat_rawat_jalan = parseSetField(row.tempat_rawat_jalan);
    row.tempat_rawat_inap = parseSetField(row.tempat_rawat_inap);

    return res.json(row);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/* =======================
   UPDATE
======================= */
export const updateIndividu = async (req, res) => {
  try {
    const { nik } = req.params;
    const data = { ...req.body };

    data.jaminan_kesehatan = joinSetField(data.jaminan_kesehatan);
    data.disabilitas = joinSetField(data.disabilitas);
    data.penyakit = joinSetField(data.penyakit);
    data.tempat_rawat_jalan = joinSetField(data.tempat_rawat_jalan);
    data.tempat_rawat_inap = joinSetField(data.tempat_rawat_inap);

    const [result] = await db.query("UPDATE individu SET ? WHERE nik = ?", [
      data,
      nik,
    ]);

    if (!result.affectedRows) {
      return res.status(404).json({
        message: "Data individu tidak ditemukan",
      });
    }

    return res.json({
      message: "Data individu berhasil diupdate",
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/* =======================
   DELETE
======================= */
export const deleteIndividu = async (req, res) => {
  try {
    const { nik } = req.params;

    const [result] = await db.query("DELETE FROM individu WHERE nik = ?", [
      nik,
    ]);

    if (!result.affectedRows) {
      return res.status(404).json({
        message: "Data individu tidak ditemukan",
      });
    }

    return res.json({
      message: "Data individu berhasil dihapus",
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/* ======================================================
   IMPORT INDIVIDU (CSV / XLSX) — VERCEL SAFE
====================================================== */
export const importIndividu = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "File tidak ditemukan" });
  }

  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];

    const rows = XLSX.utils.sheet_to_json(sheet, {
      defval: "",
      raw: false,
    });

    if (!rows.length) {
      throw new Error("File kosong");
    }

    let success = 0;
    let failed = [];

    for (let i = 0; i < rows.length; i++) {
      const r = rows[i];

      if (!r.nik || !r.no_kk || !r.nama) {
        failed.push({
          row: i + 2,
          error: "nik, no_kk, nama wajib diisi",
        });
        continue;
      }

      const [[kk]] = await conn.query(
        "SELECT no_kk FROM keluarga WHERE no_kk = ?",
        [r.no_kk]
      );

      if (!kk) {
        failed.push({
          row: i + 2,
          error: `KK ${r.no_kk} tidak ditemukan`,
        });
        continue;
      }

      try {
        await conn.query(
          `INSERT INTO individu (
            nik, no_kk, nama, lindongan, jenis_kelamin, usia, tanggal_lahir,
            status_pernikahan, agama, warga_negara, akta_kelahiran, ijazah,
            kegiatan_utama, pip, deskripsi_pekerjaan, pekerjaan_utama,
            status_pekerjaan, pendapatan,
            jaminan_kesehatan, disabilitas, penyakit,
            rawat_jalan, kali_rawat_jalan, tempat_rawat_jalan,
            rawat_inap, kali_rawat_inap, tempat_rawat_inap, catatan
          ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
          [
            r.nik,
            r.no_kk,
            r.nama,
            r.lindongan || null,
            r.jenis_kelamin || null,
            r.usia || null,
            r.tanggal_lahir || null,
            r.status_pernikahan || null,
            r.agama || null,
            r.warga_negara || null,
            r.akta_kelahiran || null,
            r.ijazah || null,
            r.kegiatan_utama || null,
            r.pip || null,
            r.deskripsi_pekerjaan || null,
            r.pekerjaan_utama || null,
            r.status_pekerjaan || null,
            r.pendapatan || null,
            joinSetField(r.jaminan_kesehatan),
            joinSetField(r.disabilitas),
            joinSetField(r.penyakit),
            r.rawat_jalan || null,
            r.kali_rawat_jalan || null,
            joinSetField(r.tempat_rawat_jalan),
            r.rawat_inap || null,
            r.kali_rawat_inap || null,
            joinSetField(r.tempat_rawat_inap),
            r.catatan || null,
          ]
        );

        success++;
      } catch (e) {
        failed.push({
          row: i + 2,
          error: e.code === "ER_DUP_ENTRY" ? "NIK duplikat" : e.message,
        });
      }
    }

    await conn.commit();

    return res.status(200).json({
      message: "Import selesai",
      success,
      failed,
      total: rows.length,
    });
  } catch (err) {
    await conn.rollback();
    return res.status(500).json({
      message: "Gagal import data",
      error: err.message,
    });
  } finally {
    conn.release();
  }
};
