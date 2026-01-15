import React, { useState } from "react";
import api from "../../api/config.js";
import Notification from "../Notification.jsx";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function PasswordChangeForm() {
  const [form, setForm] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [show, setShow] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const toggleShow = (field) => {
    setShow({ ...show, [field]: !show[field] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.new_password !== form.confirm_password) {
      setError("Konfirmasi password tidak cocok.");
      return;
    }

    setSaving(true);

    try {
      await api.put("api/auth/change-password", {
        password_lama: form.current_password,
        password_baru: form.new_password,
      });

      setSuccessMessage("Password berhasil diperbarui!");
      setForm({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Gagal mengubah password.");
    } finally {
      setSaving(false);

      setTimeout(() => {
        setSuccessMessage(null);
        setError(null);
      }, 3000);
    }
  };

  return (
    <div className="p-6 mt-4 bg-white border rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
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

      <h3 className="mb-4 text-lg font-semibold">Ganti Password</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Password Lama */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Password Saat Ini</label>
          <div className="relative">
            <input
              type={show.current ? "text" : "password"}
              name="current_password"
              value={form.current_password}
              onChange={handleChange}
              placeholder="********"
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-900 dark:border-gray-700"
              required
            />
            <span
              onClick={() => toggleShow("current")}
              className="absolute text-xl text-gray-500 cursor-pointer right-3 top-2"
            >
              {show.current ? <FiEyeOff /> : <FiEye />}
            </span>
          </div>
        </div>

        {/* Password Baru */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Password Baru</label>
          <div className="relative">
            <input
              type={show.new ? "text" : "password"}
              name="new_password"
              value={form.new_password}
              onChange={handleChange}
              placeholder="********"
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-900 dark:border-gray-700"
              required
            />
            <span
              onClick={() => toggleShow("new")}
              className="absolute text-xl text-gray-500 cursor-pointer right-3 top-2"
            >
              {show.new ? <FiEyeOff /> : <FiEye />}
            </span>
          </div>
        </div>

        {/* Konfirmasi Password */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Konfirmasi Password</label>
          <div className="relative">
            <input
              type={show.confirm ? "text" : "password"}
              name="confirm_password"
              value={form.confirm_password}
              onChange={handleChange}
              placeholder="********"
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-900 dark:border-gray-700"
              required
            />
            <span
              onClick={() => toggleShow("confirm")}
              className="absolute text-xl text-gray-500 cursor-pointer right-3 top-2"
            >
              {show.confirm ? <FiEyeOff /> : <FiEye />}
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? "Menyimpan..." : "Ubah Password"}
        </button>
      </form>
    </div>
  );
}
