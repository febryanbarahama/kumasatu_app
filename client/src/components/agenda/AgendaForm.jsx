import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/config.js";
import Toast from "../../components/form/Toast.jsx";

export default function AgendaForm({ isEdit }) {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    category: "",
    image: "",
    description: "",
  });

  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [previewImage, setPreviewImage] = useState("");
  const [loadingPreview, setLoadingPreview] = useState(false);

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  /* ================= FETCH DATA (EDIT) ================= */
  useEffect(() => {
    if (isEdit && id) {
      api
        .get(`/agenda/${id}`)
        .then((res) => {
          const data = res.data;

          setForm({
            title: data.title || "",
            date: data.date ? data.date.split("T")[0] : "",
            time: data.time || "",
            location: data.location || "",
            category: data.category || "",
            image: data.image || "",
            description: data.description || "",
          });

          if (data.image) {
            const baseURL =
              import.meta.env.VITE_API_URL || "http://localhost:5000";
            setPreviewImage(`${baseURL}${data.image}`);
          }
        })
        .catch(() => showToast("Gagal memuat data agenda", "error"));
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

  /* ================= IMAGE UPLOAD ================= */
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      showToast("Ukuran gambar maksimal 5MB", "error");
      return;
    }

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      showToast("Format gambar harus JPG, PNG, atau WebP", "error");
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

      setForm((prev) => ({ ...prev, image: res.data.url }));
    } catch {
      showToast("Upload gambar gagal", "error");
    } finally {
      setLoadingPreview(false);
    }
  };

  /* ================= VALIDATION ================= */
  const validate = () => {
    const errs = {};
    if (!form.title) errs.title = "Judul wajib diisi";
    if (!form.date) errs.date = "Tanggal wajib diisi";
    if (!form.location) errs.location = "Lokasi wajib diisi";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      if (isEdit) {
        await api.put(`/agenda/${id}`, form);
        showToast("Agenda berhasil diperbarui");
      } else {
        await api.post("/agenda", form);
        showToast("Agenda berhasil ditambahkan");
      }

      setTimeout(() => navigate("/dashboard/informasi/agenda"), 1500);
    } catch {
      showToast("Gagal menyimpan agenda", "error");
    }
  };

  /* ================= UI ================= */
  return (
    <div className="max-w-5xl p-6 mx-auto bg-white rounded-lg shadow-md dark:bg-gray-800">
      <h2 className="mb-6 text-2xl font-semibold">
        {isEdit ? "Edit Agenda" : "Tambah Agenda"}
      </h2>

      <Toast show={toast.show} message={toast.message} type={toast.type} />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* TITLE */}
        <div>
          <label className="font-medium">Judul Agenda *</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full p-3 mt-1 border rounded-md dark:bg-gray-700"
          />
          {errors.title && <p className="text-red-600">{errors.title}</p>}
        </div>

        {/* DATE & TIME */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="font-medium">Tanggal *</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="w-full p-3 mt-1 border rounded-md dark:bg-gray-700"
            />
            {errors.date && <p className="text-red-600">{errors.date}</p>}
          </div>

          <div>
            <label className="font-medium">Waktu</label>
            <input
              type="time"
              name="time"
              value={form.time}
              onChange={handleChange}
              className="w-full p-3 mt-1 border rounded-md dark:bg-gray-700"
            />
          </div>
        </div>

        {/* LOCATION */}
        <div>
          <label className="font-medium">Lokasi *</label>
          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
            className="w-full p-3 mt-1 border rounded-md dark:bg-gray-700"
          />
          {errors.location && <p className="text-red-600">{errors.location}</p>}
        </div>

        {/* CATEGORY */}
        <div>
          <label className="font-medium">Kategori</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full p-3 mt-1 border rounded-md dark:bg-gray-700"
          >
            <option value="">-- Pilih kategori --</option>
            <option value="Rapat">Rapat</option>
            <option value="Kegiatan">Kegiatan</option>
            <option value="Peringatan">Peringatan</option>
            <option value="Lainnya">Lainnya</option>
          </select>
        </div>

        {/* IMAGE */}
        <div>
          <label className="font-medium">Gambar</label>
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

        {/* DESCRIPTION */}
        <div>
          <label className="font-medium">Deskripsi</label>
          <textarea
            name="description"
            rows="4"
            value={form.description}
            onChange={handleChange}
            className="w-full p-3 mt-1 border rounded-md dark:bg-gray-700"
          />
        </div>

        {/* ACTIONS */}
        <div className="flex gap-4 pt-4">
          <button className="px-6 py-3 text-white bg-blue-600 rounded-md">
            {isEdit ? "Update" : "Simpan"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/dashboard/informasi/agenda")}
            className="text-blue-600 hover:underline"
          >
            ← Kembali
          </button>
        </div>
      </form>
    </div>
  );
}
