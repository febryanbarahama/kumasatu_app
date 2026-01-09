import React, { useEffect, useState } from "react";
import api from "../../api/config.js";
import Notification from "../Notification.jsx";

export default function AccountInfoForm() {
  const [form, setForm] = useState({
    username: "",
    email: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const fetchAccount = async () => {
    try {
      const res = await api.get("/auth/profile");
      setForm({
        username: res.data.username || "",
        email: res.data.email || "",
      });
    } catch (err) {
      setError("Gagal memuat informasi akun.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccount();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await api.put("/auth/update", form);
      setSuccessMessage("Informasi akun berhasil diperbarui!");
    } catch (err) {
      setError(err.response?.data?.message || "Gagal memperbarui akun.");
    } finally {
      setSaving(false);
      setTimeout(() => {
        setSuccessMessage(null);
        setError(null);
      }, 3000);
    }
  };

  if (loading)
    return (
      <div className="p-6 text-center bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-700">
        Memuat informasi akun...
      </div>
    );

  return (
    <div className="p-6 bg-white border rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <Notification
        message={successMessage}
        type="success"
        onClose={() => setSuccessMessage(null)}
      />
      <Notification
        message={error}
        type="error"
        onClose={() => setError(null)}
      />

      <h3 className="mb-4 text-lg font-semibold">Informasi Akun</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Username */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Username</label>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            className="px-3 py-2 border rounded-md dark:bg-gray-900 dark:border-gray-700"
            required
          />
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="px-3 py-2 border rounded-md dark:bg-gray-900 dark:border-gray-700"
            required
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </form>
    </div>
  );
}
