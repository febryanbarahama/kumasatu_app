import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/config.js";
import Toast from "../../components/form/Toast.jsx";

export default function BeritaForm({ isEdit }) {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    image: "",
    category: "",
    author: "Admin Kampung Kuma I",
    date: "",
  });

  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [previewImage, setPreviewImage] = useState("");
  const [loadingPreview, setLoadingPreview] = useState(false);

  const MAX_FILE_SIZE = 5 * 1024 * 1024;

  useEffect(() => {
    if (isEdit && id) {
      api
        .get(`/berita/${id}`)
        .then((res) => {
          const data = res.data;

          // --- Format tanggal dari database ---
          let formattedDate = "";
          if (data.date) {
            formattedDate = data.date.split("T")[0];
          }

          setForm({
            ...data,
            date: formattedDate,
          });

          // --- Preview Gambar ---
          if (data.image) {
            const baseURL =
              import.meta.env.VITE_API_URL || "http://localhost:5000";
            setPreviewImage(`${baseURL}${data.image}`);
          } else {
            setPreviewImage("");
          }
        })
        .catch(() => showToast("Data gagal dimuat", "error"));
    }
  }, [isEdit, id]);

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false }), 3000);
  };

  const handleChange = (e) => {
    let { name, value } = e.target;

    if (name === "title") {
      const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      setForm((prev) => ({ ...prev, title: value, slug }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  /** UPLOAD  */
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validasi size
    if (file.size > MAX_FILE_SIZE) {
      showToast("Ukuran gambar maksimal 5MB", "error");
      return;
    }

    // Validasi tipe file
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      showToast("Format gambar harus JPG, PNG, atau WebP", "error");
      return;
    }

    setLoadingPreview(true);

    // Preview local (blur)
    const localPreview = URL.createObjectURL(file);
    setPreviewImage(localPreview);

    try {
      const formData = new FormData();
      formData.append("image", file);

      // Upload ke server
      const res = await api.post("/upload/image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Set URL yang tersimpan di backend
      setForm((prev) => ({ ...prev, image: res.data.url }));

      setTimeout(() => {
        setLoadingPreview(false);
      }, 300);
    } catch (err) {
      console.error(err);
      showToast("Upload gambar gagal", "error");
      setLoadingPreview(false);
    }
  };

  const validate = () => {
    const errs = {};
    if (!form.title) errs.title = "Judul wajib diisi";
    if (!form.slug) errs.slug = "Slug wajib diisi";
    if (!form.content) errs.content = "Konten wajib diisi";
    if (!form.date) errs.date = "Tanggal wajib diisi";
    if (!form.category) errs.category = "Kategori wajib dipilih";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      if (isEdit) {
        await api.put(`/berita/${id}`, form);
        showToast("Berita berhasil diperbarui", "success");
      } else {
        await api.post("/berita", form);
        showToast("Berita berhasil ditambahkan", "success");
      }

      setTimeout(() => navigate("/dashboard/informasi/berita"), 1500);
    } catch {
      showToast("Gagal menyimpan data", "error");
    }
  };

  return (
    <div className="max-w-5xl p-6 mx-auto bg-white rounded-lg shadow-md dark:bg-gray-800">
      <h2 className="mb-6 text-2xl font-semibold">
        {isEdit ? "Edit Berita" : "Tambah Berita"}
      </h2>

      <Toast show={toast.show} message={toast.message} type={toast.type} />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* TITLE */}
        <div>
          <label className="font-medium">Judul Berita *</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full p-3 mt-1 border rounded-md dark:bg-gray-700 dark:text-white"
          />
          {errors.title && <p className="text-red-600">{errors.title}</p>}
        </div>

        {/* SLUG */}
        <div>
          <label className="font-medium">Slug *</label>
          <input
            type="text"
            name="slug"
            value={form.slug}
            onChange={handleChange}
            className="w-full p-3 mt-1 border rounded-md dark:bg-gray-700 dark:text-white"
          />
          {errors.slug && <p className="text-red-600">{errors.slug}</p>}
        </div>

        {/* EXCERPT */}
        <div>
          <label className="font-medium">Excerpt</label>
          <textarea
            name="excerpt"
            rows="2"
            value={form.excerpt}
            onChange={handleChange}
            className="w-full p-3 mt-1 border rounded-md dark:bg-gray-700 dark:text-white"
          ></textarea>
        </div>

        {/* CONTENT */}
        <div>
          <label className="font-medium">Konten *</label>
          <textarea
            name="content"
            rows="8"
            value={form.content}
            onChange={handleChange}
            className="w-full p-3 mt-1 border rounded-md dark:bg-gray-700 dark:text-white"
          ></textarea>
          {errors.content && <p className="text-red-600">{errors.content}</p>}
        </div>

        {/* IMAGE UPLOAD */}
        <div>
          <label className="font-medium">Gambar Berita *</label>
          <p className="text-xs text-gray-500">
            Maksimal ukuran file: 5MB (JPG / PNG / WebP)
          </p>

          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full p-3 mt-1 border rounded-md cursor-pointer dark:bg-gray-700 dark:text-white"
          />

          {errors.image && <p className="text-red-600">{errors.image}</p>}

          {/* PREVIEW */}
          {previewImage && (
            <div className="relative w-40 h-40 mt-3 overflow-hidden border rounded-md">
              <img
                src={previewImage}
                alt="preview"
                className={`object-cover w-full h-full transition duration-300 ${
                  loadingPreview ? "blur-md scale-105 opacity-70" : "blur-0"
                }`}
              />

              {loadingPreview && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-white rounded-full border-t-transparent animate-spin"></div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* CATEGORY */}
        <div>
          <label className="font-medium">Kategori *</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full p-3 mt-1 border rounded-md dark:bg-gray-700 dark:text-white"
          >
            <option value="">-- Pilih kategori --</option>
            <option value="Pemerintahan">Pemerintahan</option>
            <option value="Pendidikan">Pendidikan</option>
            <option value="Kesehatan">Kesehatan</option>
            <option value="Pembangunan">Pembangunan</option>
            <option value="Sosial Kemasyarakatan">Sosial Kemasyarakatan</option>
            <option value="Ekonomi">Ekonomi</option>
            <option value="Lainnya">Lainnya</option>
          </select>
          {errors.category && <p className="text-red-600">{errors.category}</p>}
        </div>

        {/* AUTHOR */}
        <div>
          <label className="font-medium">Author</label>
          <input
            type="text"
            name="author"
            value={form.author}
            onChange={handleChange}
            className="w-full p-3 mt-1 border rounded-md dark:bg-gray-700 dark:text-white"
          />
        </div>

        {/* DATE */}
        <div>
          <label className="font-medium">Tanggal *</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="w-full p-3 mt-1 border rounded-md dark:bg-gray-700 dark:text-white"
          />
          {errors.date && <p className="text-red-600">{errors.date}</p>}
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex items-center gap-4 pt-4">
          <button
            type="submit"
            className="px-6 py-3 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            {isEdit ? "Update" : "Simpan"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/dashboard/informasi/berita")}
            className="text-blue-600 hover:underline"
          >
            ← Kembali
          </button>
        </div>
      </form>
    </div>
  );
}
