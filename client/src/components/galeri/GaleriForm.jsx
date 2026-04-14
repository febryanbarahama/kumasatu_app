import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/config";
import Toast from "../../components/form/Toast";

export default function GaleriForm({ isEdit }) {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    title: "",
    date: "",
    category: "",
    image: "", // ✅ selalu URL
    description: "",
    status: "active",
    author: "Admin Kampung Kuma I",
  });

  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [previewImage, setPreviewImage] = useState("");
  const [loadingPreview, setLoadingPreview] = useState(false);

  const MAX_FILE_SIZE = 5 * 1024 * 1024;

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    if (isEdit && id) {
      api
        .get(`api/galeri/${id}`)
        .then((res) => {
          const data = res.data;

          setForm({
            title: data.title || "",
            date: data.date ? data.date.split("T")[0] : "",
            category: data.category || "",
            image: data.image || "",
            description: data.description || "",
            status: data.status || "active",
            author: data.author || "Admin Kampung Kuma I",
          });

          // ✅ langsung pakai URL
          if (data.image) {
            setPreviewImage(data.image);
          }
        })
        .catch(() => showToast("Gagal memuat data galeri", "error"));
    }
  }, [isEdit, id]);

  /* ================= TOAST ================= */
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false }), 3000);
  };

  /* ================= HANDLE INPUT ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  /* ================= UPLOAD IMAGE ================= */
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // VALIDASI
    if (file.size > MAX_FILE_SIZE) {
      showToast("Ukuran gambar maksimal 5MB", "error");
      return;
    }

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      showToast("Format harus JPG, PNG, WebP", "error");
      return;
    }

    // preview lokal (cepat)
    setPreviewImage(URL.createObjectURL(file));
    setLoadingPreview(true);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await api.post("api/upload/image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // ✅ simpan URL (INI KUNCI)
      setForm((prev) => ({
        ...prev,
        image: res.data.url,
      }));

      showToast("Upload gambar berhasil");
    } catch {
      showToast("Upload gagal", "error");
    } finally {
      setLoadingPreview(false);
    }
  };

  /* ================= VALIDASI ================= */
  const validate = () => {
    const errs = {};
    if (!form.title) errs.title = "Judul wajib diisi";
    if (!form.date) errs.date = "Tanggal wajib diisi";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      // 🔥 DEBUG (boleh hapus nanti)
      console.log("SUBMIT DATA:", form);

      if (isEdit) {
        await api.put(`api/galeri/${id}`, form); // ✅ JSON (BUKAN FormData)
        showToast("Galeri berhasil diperbarui");
      } else {
        await api.post("api/galeri", form); // ✅ JSON
        showToast("Galeri berhasil ditambahkan");
      }

      setTimeout(() => navigate("/dashboard/galeri"), 1500);
    } catch {
      showToast("Gagal menyimpan galeri", "error");
    }
  };

  /* ================= UI ================= */
  return (
    <div className="max-w-5xl p-6 mx-auto bg-white rounded-lg shadow-md dark:bg-gray-800">
      <h2 className="mb-6 text-2xl font-semibold">
        {isEdit ? "Edit Galeri" : "Tambah Galeri"}
      </h2>

      <Toast {...toast} />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* TITLE */}
        <div>
          <label className="font-medium">Judul *</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full p-3 mt-1 border rounded-md dark:bg-gray-700"
          />
          {errors.title && <p className="text-red-600">{errors.title}</p>}
        </div>

        {/* CATEGORY */}
        <div>
          <label className="font-medium">Kategori</label>
          <input
            type="text"
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full p-3 mt-1 border rounded-md dark:bg-gray-700"
          />
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

          {loadingPreview && (
            <p className="mt-2 text-sm text-gray-500">Mengupload gambar...</p>
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

        {/* AUTHOR */}
        <div>
          <label className="font-medium">Author</label>
          <input
            type="text"
            name="author"
            value={form.author}
            onChange={handleChange}
            className="w-full p-3 mt-1 border rounded-md dark:bg-gray-700"
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
            className="w-full p-3 mt-1 border rounded-md dark:bg-gray-700"
          />
          {errors.date && <p className="text-red-600">{errors.date}</p>}
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
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* ACTION */}
        <div className="flex gap-4 pt-4">
          <button className="px-6 py-3 text-white bg-blue-600 rounded-md">
            {isEdit ? "Update" : "Simpan"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/dashboard/galeri")}
            className="text-blue-600 hover:underline"
          >
            ← Kembali
          </button>
        </div>
      </form>
    </div>
  );
}
