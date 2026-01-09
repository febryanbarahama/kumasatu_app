import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/config.js";
import Toast from "../form/Toast.jsx";

/* ================= KONSTANTA JABATAN ================= */
const JABATAN_OPTIONS = [
  "Kapitalaung",
  "Sekretaris",
  "Kaur Umum dan Perencanaan",
  "Kaur Keuangan",
  "Kasi Pemerintahan",
  "Kasi Kesehjateraan dan Pelayanan",
  "Kepala Lindongan I",
  "Kepala Lindongan II",
  "Kepala Lindongan III",
];

export default function AparaturForm({ isEdit }) {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    nama: "",
    jabatan: "",
    wa: "",
    ig: "",
    fb: "",
    email: "",
    status: "aktif",
    foto: "",
  });

  const [jabatanSelect, setJabatanSelect] = useState("");
  const [jabatanCustom, setJabatanCustom] = useState("");

  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [previewImage, setPreviewImage] = useState("");
  const [loadingPreview, setLoadingPreview] = useState(false);

  const MAX_FILE_SIZE = 5 * 1024 * 1024;
  const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  /* ================= FETCH DATA (EDIT) ================= */
  useEffect(() => {
    if (isEdit && id) {
      api
        .get(`/aparatur/${id}`)
        .then((res) => {
          const data = res.data;
          const jabatanDb = data.jabatan || "";

          const isPreset = JABATAN_OPTIONS.includes(jabatanDb);

          setForm({
            nama: data.nama || "",
            jabatan: jabatanDb,
            wa: data.wa || "",
            ig: data.ig || "",
            fb: data.fb || "",
            email: data.email || "",
            status: data.status || "aktif",
            foto: data.foto || "",
          });

          setJabatanSelect(isPreset ? jabatanDb : "LAINNYA");
          setJabatanCustom(isPreset ? "" : jabatanDb);

          if (data.foto) {
            setPreviewImage(`${baseURL}${data.foto}`);
          }
        })
        .catch(() => showToast("Gagal memuat data aparatur", "error"));
    }
  }, [isEdit, id]);

  /* ================= HELPERS ================= */
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false }), 3000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  /* ================= JABATAN HANDLER ================= */
  const handleJabatanSelect = (e) => {
    const value = e.target.value;
    setJabatanSelect(value);

    if (value === "LAINNYA") {
      setForm((prev) => ({ ...prev, jabatan: jabatanCustom }));
    } else {
      setJabatanCustom("");
      setForm((prev) => ({ ...prev, jabatan: value }));
    }
  };

  const handleJabatanCustom = (e) => {
    const value = e.target.value;
    setJabatanCustom(value);
    setForm((prev) => ({ ...prev, jabatan: value }));
  };

  /* ================= FOTO UPLOAD ================= */
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      showToast("Ukuran foto maksimal 5MB", "error");
      return;
    }

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      showToast("Format foto harus JPG, PNG, atau WebP", "error");
      return;
    }

    setLoadingPreview(true);
    setPreviewImage(URL.createObjectURL(file));

    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await api.post("/upload/image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setForm((prev) => ({ ...prev, foto: res.data.url }));
    } catch {
      showToast("Upload foto gagal", "error");
    } finally {
      setLoadingPreview(false);
    }
  };

  /* ================= VALIDATION ================= */
  const validate = () => {
    const errs = {};
    if (!form.nama) errs.nama = "Nama wajib diisi";
    if (!form.jabatan) errs.jabatan = "Jabatan wajib diisi";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      if (isEdit) {
        await api.put(`/aparatur/${id}`, form);
        showToast("Data aparatur berhasil diperbarui");
      } else {
        await api.post("/aparatur", form);
        showToast("Data aparatur berhasil ditambahkan");
      }

      setTimeout(() => navigate("/dashboard/profil-kampung/aparatur"), 1500);
    } catch {
      showToast("Gagal menyimpan data aparatur", "error");
    }
  };

  /* ================= UI ================= */
  return (
    <div className="max-w-5xl p-6 mx-auto bg-white rounded-lg shadow-md dark:bg-gray-800">
      <h2 className="mb-6 text-2xl font-semibold">
        {isEdit ? "Edit Aparatur" : "Tambah Aparatur"}
      </h2>

      <Toast show={toast.show} message={toast.message} type={toast.type} />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* NAMA */}
        <div>
          <label className="font-medium">Nama *</label>
          <input
            type="text"
            name="nama"
            value={form.nama}
            onChange={handleChange}
            className="w-full p-3 mt-1 border rounded-md dark:bg-gray-700"
          />
          {errors.nama && <p className="text-red-600">{errors.nama}</p>}
        </div>

        {/* JABATAN */}
        <div>
          <label className="font-medium">Jabatan *</label>
          <select
            value={jabatanSelect}
            onChange={handleJabatanSelect}
            className="w-full p-3 mt-1 border rounded-md dark:bg-gray-700"
          >
            <option value="">-- Pilih Jabatan --</option>
            {JABATAN_OPTIONS.map((j) => (
              <option key={j} value={j}>
                {j}
              </option>
            ))}
            <option value="LAINNYA">Lainnya</option>
          </select>

          {jabatanSelect === "LAINNYA" && (
            <input
              type="text"
              placeholder="Isi jabatan lainnya"
              value={jabatanCustom}
              onChange={handleJabatanCustom}
              className="w-full p-3 mt-2 border rounded-md dark:bg-gray-700"
            />
          )}

          {errors.jabatan && <p className="text-red-600">{errors.jabatan}</p>}
        </div>

        {/* KONTAK */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="font-medium">WhatsApp</label>
            <input
              type="text"
              name="wa"
              value={form.wa}
              onChange={handleChange}
              className="w-full p-3 mt-1 border rounded-md dark:bg-gray-700"
            />
          </div>

          <div>
            <label className="font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full p-3 mt-1 border rounded-md dark:bg-gray-700"
            />
          </div>
        </div>

        {/* SOSIAL MEDIA */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="font-medium">Instagram</label>
            <input
              type="text"
              name="ig"
              value={form.ig}
              onChange={handleChange}
              className="w-full p-3 mt-1 border rounded-md dark:bg-gray-700"
            />
          </div>

          <div>
            <label className="font-medium">Facebook</label>
            <input
              type="text"
              name="fb"
              value={form.fb}
              onChange={handleChange}
              className="w-full p-3 mt-1 border rounded-md dark:bg-gray-700"
            />
          </div>
        </div>

        {/* STATUS */}
        <div>
          <label className="font-medium">Status</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full p-3 mt-1 border rounded-md dark:bg-gray-700"
          >
            <option value="aktif">Aktif</option>
            <option value="nonaktif">Nonaktif</option>
          </select>
        </div>

        {/* FOTO */}
        <div>
          <label className="font-medium">Foto</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full p-3 mt-1 border rounded-md dark:bg-gray-700"
          />

          {previewImage && (
            <img
              src={previewImage}
              alt="preview"
              className="object-cover w-40 h-40 mt-3 border rounded"
            />
          )}
        </div>

        {/* ACTIONS */}
        <div className="flex gap-4 pt-4">
          <button className="px-6 py-3 text-white bg-blue-600 rounded-md">
            {isEdit ? "Update" : "Simpan"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/dashboard/profil-kampung/aparatur")}
            className="text-blue-600 hover:underline"
          >
            ← Kembali
          </button>
        </div>
      </form>
    </div>
  );
}
