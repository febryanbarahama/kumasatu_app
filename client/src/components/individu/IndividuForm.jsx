// src/components/IndividuForm.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/config.js";

import FieldInput from "../form/FieldInput.jsx";
import Toast from "../form/Toast.jsx";

export default function IndividuForm() {
  const { nik } = useParams();
  const navigate = useNavigate();

  const fieldsConfig = [
    { name: "nik", label: "NIK", type: "text", required: true, maxLength: 16 },
    {
      name: "no_kk",
      label: "No KK",
      type: "text",
      required: true,
      maxLength: 16,
    },
    { name: "nama", label: "Nama", type: "text", required: true },
    {
      name: "lindongan",
      label: "Lindongan",
      type: "select",
      options: ["Lindongan 1", "Lindongan 2", "Lindongan 3"],
      required: true,
    },
    {
      name: "jenis_kelamin",
      label: "Jenis Kelamin",
      type: "select",
      options: ["laki-laki", "perempuan"],
      required: true,
    },
    { name: "usia", label: "Usia", type: "number", required: true },
    {
      name: "tanggal_lahir",
      label: "Tanggal Lahir",
      type: "date",
      required: true,
    },
    {
      name: "status_pernikahan",
      label: "Status Pernikahan",
      type: "select",
      options: ["belum kawin", "kawin", "cerai hidup", "cerai mati"],
      required: true,
    },
    {
      name: "agama",
      label: "Agama",
      type: "select",
      options: ["Islam", "Kristen", "Katolik", "Hindu", "Buddha", "Konghucu"],
      required: true,
    },
    {
      name: "warga_negara",
      label: "Warga Negara",
      type: "select",
      options: ["WNI", "WNA"],
      required: true,
    },
    {
      name: "akta_kelahiran",
      label: "Akta Kelahiran",
      type: "select",
      options: ["Tidak ada", "Ada"],
      required: true,
    },
    {
      name: "ijazah_terakhir",
      label: "Ijazah Terakhir",
      type: "select",
      options: [
        "Tidak/belum bersekolah",
        "SD/sederajat",
        "SMP/sederajat",
        "SMA/SMK/sederajat",
        "Perguruan Tinggi",
      ],
      required: true,
    },
    {
      name: "kegiatan_utama",
      label: "Kegiatan Utama",
      type: "select",
      options: ["Bekerja", "Mengurus Rumah Tangga", "Sekolah", "Lainnya"],
      required: true,
    },
    { name: "pip", label: "PIP", type: "select", options: ["Tidak", "Ya"] },
    { name: "deskripsi_pekerjaan", label: "Deskripsi Pekerjaan", type: "text" },
    {
      name: "pekerjaan_utama",
      label: "Pekerjaan Utama",
      type: "select",
      options: [
        "Pertanian",
        "Perkebunan/Kehutanan",
        "Perikanan",
        "Pertambangan/Penggalian",
        "Industri Pengolahan",
        "Konstruksi",
        "Perdagangan Besar/Eceran",
        "Reparasi dan Perawatan Mobil/Sepeda Motor",
        "Pengangkutan/Pergudangan",
        "Pemerintahan",
        "Pendidikan",
        "Aktivitas Kesehatan dan Aktivitas Sosial Keagamaan",
        "Kesenian, Hiburan, dan Rekreasi",
        "Lainnya",
      ],
    },
    {
      name: "status_pekerjaan",
      label: "Status Pekerjaan",
      type: "select",
      options: [
        "Berusaha sendiri/dibantu pekerja",
        "Buruh/Karyawan/Pegawai",
        "Pekerja bebas",
      ],
    },
    { name: "pendapatan", label: "Pendapatan", type: "number", step: "0.01" },
    {
      name: "jaminan_kesehatan",
      label: "Jaminan Kesehatan",
      type: "select",
      multiple: true,
      options: [
        "BPJS PBI",
        "BPJS Non-PBI",
        "Jamkesda",
        "Asuransi Swasta",
        "Perusahaan/kantor",
        "Tidak memiliki",
      ],
    },
    {
      name: "disabilitas",
      label: "Disabilitas",
      type: "select",
      multiple: true,
      options: [
        "Penglihatan",
        "Pendengaran",
        "Berjalan/Naik Tangga",
        "Menggunakan/Menggerakkan Tangan/Jari",
        "Mengingat/Berkonsentrasi",
        "Perilaku/Emosional",
        "Berbicara/Komunikasi",
      ],
    },
    {
      name: "menderita_penyakit",
      label: "Menderita Penyakit",
      type: "select",
      multiple: true,
      options: [
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
    },
    {
      name: "rawat_jalan",
      label: "Rawat Jalan",
      type: "select",
      options: ["Ya", "Tidak"],
      required: true,
    },
    {
      name: "berapa_kali_rawat_jalan",
      label: "Berapa Kali Rawat Jalan",
      type: "number",
    },
    {
      name: "tempat_rawat_jalan",
      label: "Tempat Rawat Jalan",
      type: "select",
      multiple: true,
      options: [
        "Rumah Sakit",
        "Klinik",
        "Praktik dokter/bidan/perawat",
        "Puskesmas/Pustu",
        "Lainnya",
      ],
    },
    {
      name: "rawat_inap",
      label: "Rawat Inap",
      type: "select",
      options: ["Ya", "Tidak"],
      required: true,
    },
    {
      name: "berapa_kali_rawat_inap",
      label: "Berapa Kali Rawat Inap",
      type: "number",
    },
    {
      name: "tempat_rawat_inap",
      label: "Tempat Rawat Inap",
      type: "select",
      multiple: true,
      options: ["Rumah Sakit", "Klinik", "Puskesmas", "Lainnya"],
    },
    { name: "catatan", label: "Catatan", type: "text" },
  ];

  const initialState = fieldsConfig.reduce((acc, field) => {
    acc[field.name] = field.multiple ? [] : "";
    return acc;
  }, {});

  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  useEffect(() => {
    if (!nik) return;
    const fetchData = async () => {
      try {
        const res = await api.get(`/individu/${nik}`);
        const data = { ...initialState, ...res.data };

        fieldsConfig.forEach((f) => {
          if (f.multiple) {
            if (typeof data[f.name] === "string") {
              data[f.name] = data[f.name]
                ? data[f.name].split(",").map((v) => v.trim())
                : [];
            }
            if (!Array.isArray(data[f.name])) {
              data[f.name] = [];
            }
          } else {
            if (Array.isArray(data[f.name])) {
              data[f.name] = data[f.name][0] || "";
            }
            if (f.type === "date" && data[f.name]) {
              const d = new Date(data[f.name]);
              if (!isNaN(d)) {
                data[f.name] = d.toISOString().split("T")[0];
              }
            }
          }
        });

        setForm(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [nik]);

  const handleChange = (e) => {
    const { name, value, multiple, selectedOptions } = e.target;
    if (multiple) {
      setForm((prev) => ({
        ...prev,
        [name]: Array.from(selectedOptions, (opt) => opt.value),
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validate = () => {
    const newErrors = {};
    fieldsConfig.forEach((f) => {
      if (
        f.required &&
        (!form[f.name] ||
          (Array.isArray(form[f.name]) && form[f.name].length === 0))
      ) {
        newErrors[f.name] = `${f.label} wajib diisi`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const payload = { ...form };
      fieldsConfig.forEach((f) => {
        if (f.multiple && Array.isArray(payload[f.name])) {
          payload[f.name] = payload[f.name].join(",");
        }
      });
      if (nik) {
        await api.put(`/individu/${nik}`, payload);
        showToast("Data berhasil diperbarui", "success");
      } else {
        await api.post("/individu", payload);
        showToast("Data berhasil disimpan", "success");
      }
      setTimeout(() => navigate("/dashboard/penduduk/individu"), 1000);
    } catch (err) {
      console.error(err);
      showToast("Terjadi kesalahan saat menyimpan data", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl p-6 mx-auto bg-white rounded-lg shadow dark:bg-gray-800">
      <Toast show={toast.show} message={toast.message} type={toast.type} />
      <h2 className="mb-4 text-xl font-bold">
        {nik ? "Edit Individu" : "Tambah Individu"}
      </h2>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-4 md:grid-cols-2"
      >
        {fieldsConfig.map((field) => (
          <FieldInput
            key={field.name}
            label={field.label}
            name={field.name}
            type={field.type}
            value={form[field.name]}
            onChange={handleChange}
            options={field.options || []}
            maxLength={field.maxLength}
            step={field.step}
            multiple={field.multiple}
            required={field.required}
            error={errors[field.name]}
          />
        ))}
        <div className="flex justify-end md:col-span-2">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            {loading ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </form>
    </div>
  );
}
