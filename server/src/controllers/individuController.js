// src/controllers/individuController.js
import db from "../config/db.js";
import XLSX from "xlsx";
import fs from "fs/promises";

// =======================
// Helper: SET <-> Array
// =======================
const parseSetField = (field) => (field ? field.split(",") : []);
const joinSetField = (field) => {
  if (Array.isArray(field)) return field.join(",");
  if (typeof field === "string" && field.trim() !== "") {
    return field
      .split(",")
      .map((item) => item.trim())
      .join(",");
  }
  return "";
};

// =======================
// Mapping ENUM / SET
// =======================
const enumMapping = {
  status_pernikahan: {
    "tidak kawin": "belum kawin",
    "belum kawin": "belum kawin",
    kawin: "kawin",
    "cerai hidup": "cerai hidup",
    "cerai mati": "cerai mati",
  },
  lindongan: {
    "lindongan 1": "Lindongan 1",
    "lindongan 2": "Lindongan 2",
    "lindongan 3": "Lindongan 3",
  },
  jenis_kelamin: {
    laki: "laki-laki",
    "laki-laki": "laki-laki",
    perempuan: "perempuan",
  },
  agama: {
    islam: "Islam",
    kristen: "Kristen",
    katolik: "Katolik",
    hindu: "Hindu",
    buddha: "Buddha",
    konghucu: "Konghucu",
  },
  warga_negara: {
    wni: "WNI",
    wna: "WNA",
  },
  akta_kelahiran: {
    ada: "Ada",
    "tidak ada": "Tidak ada",
  },
  ijazah: {
    "tidak/belum bersekolah": "Tidak/belum bersekolah",
    "sd/sederajat": "SD/sederajat",
    "smp/sederajat": "SMP/sederajat",
    "sma/smk/sederajat": "SMA/SMK/sederajat",
    "perguruan tinggi": "Perguruan Tinggi",
  },
  kegiatan_utama: {
    bekerja: "Bekerja",
    "mengurus rumah tangga": "Mengurus Rumah Tangga",
    sekolah: "Sekolah",
    lainnya: "Lainnya",
  },
  pip: {
    ya: "Ya",
    tidak: "Tidak",
  },
  pekerjaan_utama: {
    pertanian: "Pertanian",
    "perkebunan/kehutanan": "Perkebunan/Kehutanan",
    perikanan: "Perikanan",
    "pertambangan/penggalian": "Pertambangan/Penggalian",
    "industri pengolahan": "Industri Pengolahan",
    konstruksi: "Konstruksi",
    "perdagangan besar/eceran": "Perdagangan Besar/Eceran",
    "reparasi dan perawatan mobil/sepedamotor":
      "Reparasi dan Perawatan Mobil/Sepeda Motor",
    "pengangkutan/pergudangan": "Pengangkutan/Pergudangan",
    pemerintahan: "Pemerintahan",
    pendidikan: "Pendidikan",
    "aktivitas kesehatan dan aktivitas sosial keagamaan":
      "Aktivitas Kesehatan dan Aktivitas Sosial Keagamaan",
    "kesenian, hiburan, dan rekreasi": "Kesenian, Hiburan, dan Rekreasi",
    lainnya: "Lainnya",
  },
  status_pekerjaan: {
    "berusaha sendiri/dibantu pekerja": "Berusaha sendiri/dibantu pekerja",
    "buruh/karyawan/pegawai": "Buruh/Karyawan/Pegawai",
    "pekerja bebas": "Pekerja bebas",
  },
  rawat_jalan: {
    ya: "Ya",
    tidak: "Tidak",
  },
  rawat_inap: {
    ya: "Ya",
    tidak: "Tidak",
  },
};

const setMapping = {
  jaminan_kesehatan: [
    "BPJS PBI",
    "BPJS Non-PBI",
    "Jamkesda",
    "Asuransi Swasta",
    "Perusahaan/kantor",
    "Tidak memiliki",
  ],
  disabilitas: [
    "Penglihatan",
    "Pendengaran",
    "Berjalan/Naik Tangga",
    "Menggunakan/Menggerakkan Tangan/Jari",
    "Mengingat/Berkonsentrasi",
    "Perilaku/Emosional",
    "Berbicara/Komunikasi",
  ],
  penyakit: [
    "Muntaber",
    "DBD",
    "Campak",
    "Malaria",
    "Flu Burung",
    "Covid-19",
    "Hepatitis B",
    "Hepatitis E",
    "Difteri",
    "Chikungunya",
    "Leptospirosis",
    "Kolera",
    "Gizi Buruk",
    "Jantung",
    "TBC Paru",
    "Kanker",
    "Diabetes",
    "Lumpuh",
    "Lainnya",
  ],
  tempat_rawat_jalan: [
    "Rumah Sakit",
    "Klinik",
    "Praktik dokter/bidan/perawat",
    "Puskesmas/Pustu",
    "Lainnya",
  ],
  tempat_rawat_inap: ["Rumah Sakit", "Klinik", "Puskesmas", "Lainnya"],
};

// =======================
// Utils Normalisasi
// =======================
function normalizeEnum(value, mapping) {
  if (!value && value !== 0) return null;
  const val = value.toString().trim().toLowerCase();
  return mapping[val] || null;
}

function normalizeSet(value, allowedValues) {
  if (!value) return null;
  const values = value
    .toString()
    .split(",")
    .map((v) => v.trim());
  return values.filter((v) => allowedValues.includes(v)).join(",");
}

function convertExcelDate(excelDate) {
  if (!excelDate) return null;
  if (typeof excelDate === "number") {
    const date = new Date((excelDate - 25569) * 86400 * 1000);
    return date.toISOString().split("T")[0];
  }
  const parsed = new Date(excelDate);
  return !isNaN(parsed) ? parsed.toISOString().split("T")[0] : null;
}

function calculateAge(tanggal_lahir) {
  if (!tanggal_lahir) return null;
  const birth = new Date(tanggal_lahir);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

// =======================
// CREATE
// =======================
export const createIndividu = async (req, res) => {
  try {
    const data = { ...req.body };
    const no_kk = data.no_kk;

    const [kk] = await db.query("SELECT no_kk FROM keluarga WHERE no_kk = ?", [
      no_kk,
    ]);
    if (kk.length === 0) {
      return res.status(400).json({
        message: `Nomor KK ${no_kk} tidak ditemukan. Penduduk belum terdaftar dalam keluarga.`,
      });
    }

    data.jaminan_kesehatan = joinSetField(data.jaminan_kesehatan);
    data.disabilitas = joinSetField(data.disabilitas);
    data.penyakit = joinSetField(data.penyakit);
    data.tempat_rawat_jalan = joinSetField(data.tempat_rawat_jalan);
    data.tempat_rawat_inap = joinSetField(data.tempat_rawat_inap);

    await db.query("INSERT INTO individu SET ?", [data]);
    return res.status(201).json({ message: "Data individu berhasil dibuat" });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ message: "NIK sudah terdaftar" });
    }
    return res.status(500).json({ message: err.message });
  }
};

// =======================
// READ - ALL
// =======================
export const getAllIndividu = async (req, res) => {
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

// =======================
// READ - BY NIK
// =======================
export const getIndividuByNik = async (req, res) => {
  try {
    const { nik } = req.params;
    const [rows] = await db.query("SELECT * FROM individu WHERE nik = ?", [
      nik,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Data individu tidak ditemukan" });
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

// =======================
// UPDATE - BY NIK
// =======================
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
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Data individu tidak ditemukan" });
    }
    return res.json({ message: "Data individu berhasil diupdate" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// =======================
// DELETE - BY NIK
// =======================
export const deleteIndividu = async (req, res) => {
  try {
    const { nik } = req.params;
    const [result] = await db.query("DELETE FROM individu WHERE nik = ?", [
      nik,
    ]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Data individu tidak ditemukan" });
    }
    return res.json({ message: "Data individu berhasil dihapus" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// =======================
// IMPORT EXCEL
// =======================
export const importIndividu = async (req, res) => {
  console.log("📥 Mulai proses import Excel individu...");
  if (!req.file) {
    console.error("❌ Tidak ada file yang diupload");
    return res.status(400).json({ message: "File tidak ditemukan" });
  }

  const failedRows = [];
  let processed = 0;

  try {
    console.log("📄 File diterima:", req.file.originalname);
    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    console.log("📑 Sheet terdeteksi:", sheetName);

    const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
    console.log(`📊 Jumlah baris terbaca: ${sheetData.length}`);
    if (!sheetData.length) {
      await fs.unlink(req.file.path).catch(() => {});
      return res
        .status(400)
        .json({ message: "File Excel kosong atau format salah" });
    }

    // Proses berurutan agar tidak membanjiri pool (lebih aman untuk FK/validasi)
    for (let index = 0; index < sheetData.length; index++) {
      const row = { ...sheetData[index] };

      // Normalisasi ENUM
      for (const field in enumMapping) {
        if (row[field] !== undefined) {
          row[field] = normalizeEnum(row[field], enumMapping[field]);
        }
      }
      // Normalisasi SET
      for (const field in setMapping) {
        if (row[field] !== undefined) {
          row[field] = normalizeSet(row[field], setMapping[field]);
        }
      }

      // Tanggal lahir
      let tanggalLahir = null;
      if (row.tanggal_lahir) {
        if (typeof row.tanggal_lahir === "number") {
          // Gunakan SSF untuk format nomor excel
          tanggalLahir = XLSX.SSF.format("yyyy-mm-dd", row.tanggal_lahir);
        } else {
          tanggalLahir = convertExcelDate(row.tanggal_lahir);
        }
      }

      // Hitung usia jika kosong
      if ((!row.usia || isNaN(row.usia)) && tanggalLahir) {
        row.usia = calculateAge(tanggalLahir);
      }

      const dataDb = {
        nik: row.nik?.toString().padStart(16, "0") || null,
        no_kk: row.no_kk?.toString().padStart(16, "0") || null,
        nama: row.nama || null,
        lindongan: row.lindongan || null,
        jenis_kelamin: row.jenis_kelamin || null,
        usia: row.usia ?? null,
        tanggal_lahir: tanggalLahir,
        status_pernikahan: row.status_pernikahan || null,
        agama: row.agama || null,
        warga_negara: row.warga_negara || null,
        akta_kelahiran: row.akta_kelahiran || null,
        ijazah: row.ijazah || null,
        kegiatan_utama: row.kegiatan_utama || null,
        pip: row.pip || null,
        deskripsi_pekerjaan: row.deskripsi_pekerjaan || null,
        pekerjaan_utama: row.pekerjaan_utama || null,
        status_pekerjaan: row.status_pekerjaan || null,
        pendapatan: row.pendapatan || null,
        jaminan_kesehatan: joinSetField(row.jaminan_kesehatan),
        disabilitas: joinSetField(row.disabilitas),
        penyakit: joinSetField(row.penyakit),
        rawat_jalan: row.rawat_jalan || null,
        kali_rawat_jalan: row.kali_rawat_jalan || 0,
        tempat_rawat_jalan: joinSetField(row.tempat_rawat_jalan),
        rawat_inap: row.rawat_inap || null,
        kali_rawat_inap: row.kali_rawat_inap || 0,
        tempat_rawat_inap: joinSetField(row.tempat_rawat_inap),
        catatan: row.catatan || null,
      };

      try {
        await db.query("INSERT INTO individu SET ?", [dataDb]);
        processed++;
      } catch (err) {
        let customMsg = err.message;
        if (err.code === "ER_DUP_ENTRY") {
          customMsg = "Data dengan NIK ini sudah ada";
        } else if (err.code === "ER_NO_REFERENCED_ROW_2") {
          customMsg = "No KK belum terdaftar di data keluarga";
        }
        console.error(`❌ Gagal insert row NIK ${row.nik}: ${customMsg}`);
        failedRows.push({
          row_number: index + 2, // +2: header + 1-based index
          nik: row.nik,
          error_message: customMsg,
          data: row,
        });
      }
    }

    // Bersihkan file upload
    await fs.unlink(req.file.path).catch(() => {});

    // Simpan log gagal jika ada
    let failFile = null;
    if (failedRows.length) {
      failFile = "import_gagal.json";
      await fs.writeFile(failFile, JSON.stringify(failedRows, null, 2), "utf8");
      console.warn(
        `⚠️ ${failedRows.length} baris gagal diimport. Detail disimpan di ${failFile}`
      );
    }

    return res.json({
      message: "Proses import selesai",
      sukses: processed,
      gagal: failedRows.length,
      file_gagal: failFile,
    });
  } catch (error) {
    console.error("❌ Error saat membaca/proses file:", error);
    // Pastikan file dihapus jika masih ada
    await fs.unlink(req.file.path).catch(() => {});
    return res
      .status(500)
      .json({ message: "Gagal import data", error: error.message });
  }
};
