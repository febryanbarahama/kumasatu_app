// src/components/KeluargaForm.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/config.js";

import FieldInput from "../form/FieldInput.jsx";
import CheckboxGroup from "../form/CheckboxGroup.jsx";
import LocationPicker from "../form/LocationPicker.jsx";
import Toast from "../form/Toast.jsx";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix icon default leaflet agar marker muncul
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function KeluargaForm({ isEdit }) {
  const navigate = useNavigate();
  const { no_kk } = useParams();

  const [form, setForm] = useState({
    no_kk: "",
    nama_kk: "",
    nik_kk: "",
    jenis_kelamin_kk: "",
    lindongan: "",
    jumlah_art: "",
    status_bangunan: "",
    status_kepemilikan_tanah: "",
    luas_bangunan: "",
    luas_tanah: "",
    jenis_lantai: "",
    jenis_dinding: "",
    jenis_atap: "",
    fasilitas_mck: "",
    tempat_pembuangan_tinja: "",
    sumber_air_minum: "",
    sumber_air_mandi: "",
    sumber_penerangan: "",
    daya_listrik: "",
    bahan_bakar_memasak: "",
    aset: [],
    tanah_lain: "",
    penerima_bantuan: "",
    jenis_bantuan: [],
    lokasi: { x: "", y: "" },
  });

  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const options = {
    jenis_kelamin_kk: ["laki-laki", "perempuan"],
    lindongan: ["Lindongan 1", "Lindongan 2", "Lindongan 3"],
    status_bangunan: [
      "Milik Sendiri",
      "Kontrak/Sewa",
      "Bebas Sewa",
      "Dinas",
      "Lainnya",
    ],
    status_kepemilikan_tanah: [
      "SHM atas nama Anggota Keluarga",
      "SHM bukan atas nama Anggota Keluarga",
      "Surat Hak Guna Bangunan",
      "Tidak memiliki",
    ],
    jenis_lantai: [
      "Keramik/ubin/tegel",
      "Karpet/vinil",
      "Kayu/papan",
      "Semen",
      "Bambu/tanah",
      "Lainnya",
    ],
    jenis_dinding: [
      "Tembok",
      "Kayu/papan/batang kayu",
      "Bambu/anyaman bambu",
      "Lainnya",
    ],
    jenis_atap: [
      "Beton",
      "Seng",
      "Kayu/Sirap",
      "Asbes",
      "Bambu/jerami/rumbia/daun-daun",
      "Lainnya",
    ],
    fasilitas_mck: [
      "Ada, digunakan hanya Anggota Keluarga",
      "Ada, digunakan bersama Keluarga Lain",
      "Ada, MCK Komunal/bersama",
      "Ada, MCK Umum",
      "Tidak ada fasilitas",
    ],
    tempat_pembuangan_tinja: [
      "Tangki Septik",
      "Kolam/sawah/sungai/danau/laut",
      "Lubang Tanah",
      "Lainnya",
    ],
    sumber_air_minum: [
      "Air Kemasan bermerek",
      "Air isi ulang",
      "Leding",
      "Sumur",
      "Mata air",
      "Lainnya",
    ],
    sumber_air_mandi: [
      "Air Kemasan bermerek",
      "Air isi ulang",
      "Leding",
      "Sumur",
      "Mata air",
      "Lainnya",
    ],
    sumber_penerangan: ["Listrik PLN", "Listrik Non-PLN", "Bukan Listrik"],
    daya_listrik: ["450 Watt", "900 Watt", "1300 Watt", "Lebih dari 1300 Watt"],
    bahan_bakar_memasak: [
      "Listrik",
      "Elpiji/Gas kaleng",
      "Minyak tanah",
      "Arang",
      "Kayu bakar",
      "Lainnya",
    ],
    tanah_lain: ["Ada", "Tidak ada"],
    penerima_bantuan: ["Ya", "Tidak"],
  };

  const asetOptions = [
    "Lemari es/kulkas",
    "AC",
    "Pemanas air untuk mandi",
    "Telepon rumah",
    "Komputer/laptop/tablet",
    "Sepeda motor",
    "Perahu",
    "Perahu motor",
    "Mobil",
    "Televisi layar datar minimal 30 inch",
  ];

  const jenisBantuanOptions = [
    "PKH",
    "BPNT",
    "BLT",
    "BST",
    "Banpres",
    "UMKM",
    "Pekerja",
    "Lainnya",
    "Tidak menerima",
  ];

  useEffect(() => {
    if (isEdit && no_kk) {
      api
        .get(`/keluarga/${no_kk}`)
        .then((res) => {
          const data = res.data;
          setForm({
            ...data,
            aset: data.aset ? data.aset.split(",") : [],
            jenis_bantuan: data.jenis_bantuan
              ? data.jenis_bantuan.split(",")
              : [],
            lokasi: {
              x: data.lokasi?.x || "",
              y: data.lokasi?.y || "",
            },
          });
        })
        .catch(() => showToast("Gagal memuat data keluarga.", "error"));
    }
  }, [isEdit, no_kk]);

  const validate = () => {
    const newErrors = {};
    if (!form.no_kk) newErrors.no_kk = "No. KK wajib diisi";
    else if (form.no_kk.length !== 16)
      newErrors.no_kk = "No. KK harus 16 digit";
    if (!form.nama_kk) newErrors.nama_kk = "Nama KK wajib diisi";
    if (!form.nik_kk) newErrors.nik_kk = "NIK KK wajib diisi";
    else if (form.nik_kk.length !== 16)
      newErrors.nik_kk = "NIK KK harus 16 digit";
    if (!form.jenis_kelamin_kk)
      newErrors.jenis_kelamin_kk = "Jenis kelamin wajib diisi";
    if (!form.lindongan) newErrors.lindongan = "Lindongan wajib diisi";
    if (
      form.jumlah_art === "" ||
      isNaN(Number(form.jumlah_art)) ||
      Number(form.jumlah_art) < 0
    )
      newErrors.jumlah_art = "Jumlah ART harus angka positif";
    if (!form.status_bangunan)
      newErrors.status_bangunan = "Status bangunan wajib diisi";
    if (!form.status_kepemilikan_tanah)
      newErrors.status_kepemilikan_tanah =
        "Status kepemilikan tanah wajib diisi";
    if (
      form.luas_bangunan === "" ||
      isNaN(Number(form.luas_bangunan)) ||
      Number(form.luas_bangunan) < 0
    )
      newErrors.luas_bangunan = "Luas bangunan harus angka positif";
    if (
      form.luas_tanah === "" ||
      isNaN(Number(form.luas_tanah)) ||
      Number(form.luas_tanah) < 0
    )
      newErrors.luas_tanah = "Luas tanah harus angka positif";
    if (!form.jenis_lantai) newErrors.jenis_lantai = "Jenis lantai wajib diisi";
    if (!form.jenis_dinding)
      newErrors.jenis_dinding = "Jenis dinding wajib diisi";
    if (!form.jenis_atap) newErrors.jenis_atap = "Jenis atap wajib diisi";
    if (!form.fasilitas_mck)
      newErrors.fasilitas_mck = "Fasilitas MCK wajib diisi";
    if (!form.tempat_pembuangan_tinja)
      newErrors.tempat_pembuangan_tinja = "Tempat pembuangan tinja wajib diisi";
    if (!form.sumber_air_minum)
      newErrors.sumber_air_minum = "Sumber air minum wajib diisi";
    if (!form.sumber_air_mandi)
      newErrors.sumber_air_mandi = "Sumber air mandi wajib diisi";
    if (!form.sumber_penerangan)
      newErrors.sumber_penerangan = "Sumber penerangan wajib diisi";
    if (!form.daya_listrik) newErrors.daya_listrik = "Daya listrik wajib diisi";
    if (!form.bahan_bakar_memasak)
      newErrors.bahan_bakar_memasak = "Bahan bakar memasak wajib diisi";
    if (!form.tanah_lain) newErrors.tanah_lain = "Tanah lain wajib diisi";
    if (!form.penerima_bantuan)
      newErrors.penerima_bantuan = "Penerima bantuan wajib diisi";
    if (form.lokasi.x !== "" && isNaN(Number(form.lokasi.x)))
      newErrors.lokasi_x = "Lokasi X harus berupa angka";
    if (form.lokasi.y !== "" && isNaN(Number(form.lokasi.y)))
      newErrors.lokasi_y = "Lokasi Y harus berupa angka";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "x" || name === "y") {
      setForm((prev) => ({
        ...prev,
        lokasi: { ...prev.lokasi, [name]: value },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCheckboxChange = (e, field) => {
    const { value, checked } = e.target;
    setForm((prev) => {
      const currentArray = prev[field] || [];
      if (checked) {
        return { ...prev, [field]: [...currentArray, value] };
      } else {
        return { ...prev, [field]: currentArray.filter((v) => v !== value) };
      }
    });
  };

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type }), 3500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const submitData = {
      ...form,
      aset: form.aset.join(","),
      jenis_bantuan: form.jenis_bantuan.join(","),
      jumlah_art: Number(form.jumlah_art),
      luas_bangunan: Number(form.luas_bangunan),
      luas_tanah: Number(form.luas_tanah),
      lokasi: {
        x: form.lokasi.x === "" ? null : Number(form.lokasi.x),
        y: form.lokasi.y === "" ? null : Number(form.lokasi.y),
      },
    };

    try {
      if (isEdit) {
        await api.put(`/keluarga/${no_kk}`, submitData);
        showToast("Data keluarga berhasil diupdate", "success");
      } else {
        await api.post("/keluarga", submitData);
        showToast("Data keluarga berhasil ditambahkan", "success");
      }
      setTimeout(() => navigate("/dashboard/penduduk/keluarga"), 1500);
    } catch {
      showToast("Gagal menyimpan data keluarga.", "error");
    }
  };

  // Array konfigurasi field untuk FieldInput (ringkas)
  const fieldsConfig = [
    {
      label: "No. KK",
      name: "no_kk",
      type: "text",
      maxLength: 16,
      required: true,
      disabled: isEdit,
      options: [],
    },
    { label: "Nama KK", name: "nama_kk", type: "text", required: true },
    {
      label: "NIK KK",
      name: "nik_kk",
      type: "text",
      maxLength: 16,
      required: true,
      options: [],
    },
    {
      label: "Jenis Kelamin KK",
      name: "jenis_kelamin_kk",
      type: "select",
      options: ["", ...options.jenis_kelamin_kk],
      required: true,
    },
    {
      label: "Lindongan",
      name: "lindongan",
      type: "select",
      options: ["", ...options.lindongan],
      required: true,
    },
    { label: "Jumlah ART", name: "jumlah_art", type: "number", min: 0 },
    {
      label: "Status Bangunan",
      name: "status_bangunan",
      type: "select",
      options: ["", ...options.status_bangunan],
      required: true,
    },
    {
      label: "Status Kepemilikan Tanah",
      name: "status_kepemilikan_tanah",
      type: "select",
      options: ["", ...options.status_kepemilikan_tanah],
      required: true,
    },
    {
      label: "Luas Bangunan (m²)",
      name: "luas_bangunan",
      type: "number",
      step: "any",
      min: 0,
    },
    {
      label: "Luas Tanah (m²)",
      name: "luas_tanah",
      type: "number",
      step: "any",
      min: 0,
    },
    {
      label: "Jenis Lantai",
      name: "jenis_lantai",
      type: "select",
      options: ["", ...options.jenis_lantai],
      required: true,
    },
    {
      label: "Jenis Dinding",
      name: "jenis_dinding",
      type: "select",
      options: ["", ...options.jenis_dinding],
      required: true,
    },
    {
      label: "Jenis Atap",
      name: "jenis_atap",
      type: "select",
      options: ["", ...options.jenis_atap],
      required: true,
    },
    {
      label: "Fasilitas MCK",
      name: "fasilitas_mck",
      type: "select",
      options: ["", ...options.fasilitas_mck],
      required: true,
    },
    {
      label: "Tempat Pembuangan Tinja",
      name: "tempat_pembuangan_tinja",
      type: "select",
      options: ["", ...options.tempat_pembuangan_tinja],
      required: true,
    },
    {
      label: "Sumber Air Minum",
      name: "sumber_air_minum",
      type: "select",
      options: ["", ...options.sumber_air_minum],
      required: true,
    },
    {
      label: "Sumber Air Mandi",
      name: "sumber_air_mandi",
      type: "select",
      options: ["", ...options.sumber_air_mandi],
      required: true,
    },
    {
      label: "Sumber Penerangan",
      name: "sumber_penerangan",
      type: "select",
      options: ["", ...options.sumber_penerangan],
      required: true,
    },
    {
      label: "Daya Listrik",
      name: "daya_listrik",
      type: "select",
      options: ["", ...options.daya_listrik],
      required: true,
    },
    {
      label: "Bahan Bakar Memasak",
      name: "bahan_bakar_memasak",
      type: "select",
      options: ["", ...options.bahan_bakar_memasak],
      required: true,
    },
    {
      label: "Tanah Lain",
      name: "tanah_lain",
      type: "select",
      options: ["", ...options.tanah_lain],
      required: true,
    },
    {
      label: "Penerima Bantuan",
      name: "penerima_bantuan",
      type: "select",
      options: ["", ...options.penerima_bantuan],
      required: true,
    },
  ];

  return (
    <div className="relative max-w-6xl p-6 mx-auto bg-white rounded-lg shadow-md dark:bg-gray-800">
      <h2 className="mb-6 text-2xl font-semibold text-gray-800 dark:text-gray-100">
        {isEdit ? "Edit Data Keluarga" : "Tambah Data Keluarga"}
      </h2>

      <Toast show={toast.show} message={toast.message} type={toast.type} />

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-6 md:grid-cols-2"
        noValidate
      >
        {fieldsConfig.map(
          ({
            label,
            name,
            type,
            maxLength,
            min,
            step,
            options,
            required,
            disabled,
          }) => (
            <FieldInput
              key={name}
              label={label}
              name={name}
              type={type}
              value={
                name === "x" || name === "y" ? form.lokasi[name] : form[name]
              }
              onChange={handleChange}
              maxLength={maxLength}
              min={min}
              step={step}
              options={options}
              required={required}
              disabled={disabled}
              error={errors[name]}
            />
          )
        )}

        <CheckboxGroup
          label="Aset"
          name="aset"
          options={asetOptions}
          selected={form.aset}
          onChange={handleCheckboxChange}
        />

        <CheckboxGroup
          label="Jenis Bantuan"
          name="jenis_bantuan"
          options={jenisBantuanOptions}
          selected={form.jenis_bantuan}
          onChange={handleCheckboxChange}
        />

        <LocationPicker
          lokasi={form.lokasi}
          setLokasi={(loc) => setForm((prev) => ({ ...prev, lokasi: loc }))}
          onChange={handleChange}
        />

        <div className="md:col-span-2">
          <button
            type="submit"
            className="w-full px-6 py-3 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-400"
          >
            {isEdit ? "Update Data" : "Simpan Data"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/dashboard/penduduk/keluarga")}
            className="px-4 py-2 mt-4 mb-4 font-semibold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-400 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            &larr; Kembali ke Daftar Keluarga
          </button>
        </div>
      </form>
    </div>
  );
}
