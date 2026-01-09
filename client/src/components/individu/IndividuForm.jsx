import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/config.js";
import FieldInput from "../form/FieldInput.jsx";
import Toast from "../form/Toast.jsx";

export default function IndividuForm({ isEdit }) {
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
      type: "checkbox",
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
      name: "menderita_penyakit",
      label: "Menderita Penyakit",
      type: "checkbox",
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
      type: "checkbox",
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
      type: "checkbox",
      options: ["Rumah Sakit", "Klinik", "Puskesmas", "Lainnya"],
    },
    { name: "catatan", label: "Catatan", type: "text" },
  ];

  const initialState = fieldsConfig.reduce((acc, field) => {
    acc[field.name] = field.type === "checkbox" ? [] : "";
    return acc;
  }, {});

  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  // Hapus tempat_rawat_jalan & tempat_rawat_inap dari mapping karena namanya sudah sama di API
  const fieldMap = {
    ijazah: "ijazah_terakhir",
    penyakit: "menderita_penyakit",
    kali_rawat_jalan: "berapa_kali_rawat_jalan",
    kali_rawat_inap: "berapa_kali_rawat_inap",
  };

  useEffect(() => {
    if (!nik) return;
    const fetchData = async () => {
      try {
        const res = await api.get(`/individu/${nik}`);
        let data = { ...initialState, ...res.data };

        Object.keys(fieldMap).forEach((apiField) => {
          if (data[apiField] !== undefined) {
            data[fieldMap[apiField]] = data[apiField];
          }
        });

        fieldsConfig.forEach((f) => {
          if (f.type === "checkbox") {
            if (typeof data[f.name] === "string") {
              data[f.name] = data[f.name] ? data[f.name].split(",") : [];
            } else if (!Array.isArray(data[f.name])) {
              data[f.name] = [];
            }
          }
        });

        fieldsConfig.forEach((f) => {
          if (f.type === "date" && data[f.name]) {
            try {
              data[f.name] = new Date(data[f.name]).toISOString().split("T")[0];
            } catch {
              data[f.name] = "";
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
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setForm((prev) => {
        const current = Array.isArray(prev[name]) ? prev[name] : [];
        return checked
          ? { ...prev, [name]: [...current, value] }
          : { ...prev, [name]: current.filter((v) => v !== value) };
      });
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validate = () => {
    const newErrors = {};
    fieldsConfig.forEach((f) => {
      if (f.required) {
        if (
          f.type === "checkbox" &&
          (!form[f.name] || form[f.name].length === 0)
        ) {
          newErrors[f.name] = `${f.label} wajib dipilih minimal satu`;
        } else if (!form[f.name]) {
          newErrors[f.name] = `${f.label} wajib diisi`;
        }
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
        if (f.type === "checkbox") {
          if (!Array.isArray(payload[f.name])) {
            payload[f.name] = [];
          }
          payload[f.name] = payload[f.name].join(",");
        }
      });

      Object.keys(fieldMap).forEach((apiField) => {
        const formField = fieldMap[apiField];
        if (payload[formField] !== undefined) {
          payload[apiField] = payload[formField];
          delete payload[formField];
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
        {fieldsConfig.map((field) =>
          field.type === "checkbox" ? (
            <div key={field.name} className="md:col-span-2">
              <label className="block mb-1 font-semibold">
                {field.label}{" "}
                {field.required && <span className="text-red-600">*</span>}
              </label>
              <div className="flex flex-wrap gap-4">
                {field.options.map((opt) => (
                  <label key={opt} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name={field.name}
                      value={opt}
                      checked={form[field.name]?.includes(opt)}
                      onChange={handleChange}
                      className="w-4 h-4"
                    />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
              {errors[field.name] && (
                <p className="mt-1 text-sm text-red-600">
                  {errors[field.name]}
                </p>
              )}
            </div>
          ) : (
            <FieldInput
              key={field.name}
              label={field.label}
              name={field.name}
              type={field.type}
              value={form[field.name] || ""}
              onChange={handleChange}
              options={field.options || []}
              maxLength={field.maxLength}
              step={field.step}
              required={field.required}
              error={errors[field.name]}
            />
          )
        )}
        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-400"
          >
            {isEdit ? "Update Data" : "Simpan Data"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/dashboard/penduduk/individu")}
            className="px-4 py-2 mt-4 mb-4 font-semibold text-blue-600 rounded-md hover:underline focus:outline-none focus:ring-4 focus:ring-gray-400 "
          >
            &larr; Kembali ke Daftar Keluarga
          </button>
        </div>
      </form>
    </div>
  );
}
