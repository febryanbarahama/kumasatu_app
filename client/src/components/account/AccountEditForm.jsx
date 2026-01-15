import { useState } from "react";
import api from "../../api/config";

export default function AccountEditForm({
  user,
  onSuccess,
  onError,
  refreshUser,
}) {
  const [form, setForm] = useState({
    username: user.username,
    email: user.email,
  });

  const [saving, setSaving] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await api.put("api/auth/update", form);
      onSuccess("Informasi akun berhasil diperbarui.");
      refreshUser();
    } catch (err) {
      onError("Gagal memperbarui akun.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 border border-gray-300 rounded-lg dark:border-gray-700"
    >
      <h3 className="mb-3 text-lg font-semibold">Edit Informasi Akun</h3>

      <div className="flex flex-col gap-3 text-sm">
        <div>
          <label className="block mb-1 font-medium">Username</label>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 mt-1 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-60"
        >
          {saving ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </div>
    </form>
  );
}
