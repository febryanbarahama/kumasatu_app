import React, { useEffect, useState } from "react";
import api from "../api/config.js";

export default function Keluarga() {
  const [keluarga, setKeluarga] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal & form state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingData, setEditingData] = useState(null); // null = tambah, object = edit
  const [formData, setFormData] = useState({
    no_kk: "",
    nama_kk: "",
    lindongan: "",
    jumlah_art: "",
    status_bangunan: "",
    luas_bangunan: "",
    jenis_lantai: "",
    fasilitas_mck: "",
    sumber_air_minum: "",
    sumber_penerangan: "",
    aset: "",
    penerima_bantuan: "",
    lokasi_x: "",
    lokasi_y: "",
  });

  useEffect(() => {
    fetchKeluarga();
  }, []);

  const fetchKeluarga = async () => {
    setLoading(true);
    try {
      const res = await api.get("/keluarga");
      setKeluarga(res.data);
      setError(null);
    } catch (err) {
      setError("Gagal memuat data keluarga.");
    } finally {
      setLoading(false);
    }
  };

  // Open modal for add or edit
  const openAddModal = () => {
    setEditingData(null);
    setFormData({
      no_kk: "",
      nama_kk: "",
      lindongan: "",
      jumlah_art: "",
      status_bangunan: "",
      luas_bangunan: "",
      jenis_lantai: "",
      fasilitas_mck: "",
      sumber_air_minum: "",
      sumber_penerangan: "",
      aset: "",
      penerima_bantuan: "",
      lokasi_x: "",
      lokasi_y: "",
    });
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingData(item);
    setFormData({
      no_kk: item.no_kk,
      nama_kk: item.nama_kk,
      lindongan: item.lindongan,
      jumlah_art: item.jumlah_art,
      status_bangunan: item.status_bangunan,
      luas_bangunan: item.luas_bangunan,
      jenis_lantai: item.jenis_lantai,
      fasilitas_mck: item.fasilitas_mck,
      sumber_air_minum: item.sumber_air_minum,
      sumber_penerangan: item.sumber_penerangan,
      aset: item.aset,
      penerima_bantuan: item.penerima_bantuan,
      lokasi_x: item.lokasi?.x || "",
      lokasi_y: item.lokasi?.y || "",
    });
    setModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingData) {
        // Update
        await api.put(`/keluarga/${editingData.no_kk}`, {
          ...formData,
          lokasi: { x: formData.lokasi_x, y: formData.lokasi_y },
        });
      } else {
        // Create
        await api.post("/keluarga", {
          ...formData,
          lokasi: { x: formData.lokasi_x, y: formData.lokasi_y },
        });
      }
      setModalOpen(false);
      fetchKeluarga();
    } catch (err) {
      alert("Gagal menyimpan data");
    }
  };

  const handleDelete = async (no_kk) => {
    if (window.confirm("Yakin ingin menghapus data ini?")) {
      try {
        await api.delete(`/keluarga/${no_kk}`);
        fetchKeluarga();
      } catch {
        alert("Gagal menghapus data");
      }
    }
  };

  if (loading)
    return (
      <p className="text-center text-gray-500 dark:text-gray-400">
        Loading data keluarga...
      </p>
    );

  if (error)
    return (
      <p className="text-center text-red-600 dark:text-red-400">{error}</p>
    );

  return (
    <div className="w-full">
      <h2 className="mb-4 text-2xl font-semibold">Data Keluarga</h2>

      <button
        onClick={openAddModal}
        className="px-4 py-2 mb-4 text-white bg-blue-600 rounded hover:bg-blue-700"
      >
        Tambah Data
      </button>

      <div className="overflow-x-auto border border-gray-300 rounded-md dark:border-gray-700">
        <table className="min-w-full border border-collapse border-gray-300 dark:border-gray-700">
          <thead className="bg-gray-200 dark:bg-gray-800">
            <tr>
              {[
                "No. KK",
                "Nama KK",
                "Lindongan",
                "Jumlah ART",
                "Status Bangunan",
                "Luas Bangunan (m²)",
                "Jenis Lantai",
                "Fasilitas MCK",
                "Sumber Air Minum",
                "Sumber Penerangan",
                "Aset",
                "Penerima Bantuan",
                "Lokasi (X)",
                "Lokasi (Y)",
                "Aksi",
              ].map((header) => (
                <th
                  key={header}
                  className="px-4 py-2 text-left text-gray-700 border-b border-gray-300 dark:border-gray-700 whitespace-nowrap dark:text-gray-300"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {keluarga.length === 0 ? (
              <tr>
                <td
                  colSpan={15}
                  className="py-4 text-center text-gray-500 dark:text-gray-400"
                >
                  Tidak ada data keluarga
                </td>
              </tr>
            ) : (
              keluarga.map((item) => (
                <tr
                  key={item.no_kk}
                  className="transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <td className="px-4 py-2 border-b border-gray-300 dark:border-gray-700 whitespace-nowrap">
                    {item.no_kk}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-300 dark:border-gray-700 whitespace-nowrap">
                    {item.nama_kk}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-300 dark:border-gray-700 whitespace-nowrap">
                    {item.lindongan}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-300 dark:border-gray-700 whitespace-nowrap">
                    {item.jumlah_art}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-300 dark:border-gray-700 whitespace-nowrap">
                    {item.status_bangunan}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-300 dark:border-gray-700 whitespace-nowrap">
                    {item.luas_bangunan}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-300 dark:border-gray-700 whitespace-nowrap">
                    {item.jenis_lantai}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-300 dark:border-gray-700 whitespace-nowrap">
                    {item.fasilitas_mck}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-300 dark:border-gray-700 whitespace-nowrap">
                    {item.sumber_air_minum}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-300 dark:border-gray-700 whitespace-nowrap">
                    {item.sumber_penerangan}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-300 dark:border-gray-700 whitespace-nowrap">
                    {item.aset}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-300 dark:border-gray-700 whitespace-nowrap">
                    {item.penerima_bantuan}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-300 dark:border-gray-700 whitespace-nowrap">
                    {item.lokasi?.x ?? "-"}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-300 dark:border-gray-700 whitespace-nowrap">
                    {item.lokasi?.y ?? "-"}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-300 dark:border-gray-700 whitespace-nowrap">
                    <button
                      onClick={() => openEditModal(item)}
                      className="px-2 py-1 mr-2 text-white bg-yellow-500 rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.no_kk)}
                      className="px-2 py-1 text-white bg-red-600 rounded hover:bg-red-700"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-auto">
            <h3 className="mb-4 text-xl font-semibold">
              {editingData ? "Edit Data Keluarga" : "Tambah Data Keluarga"}
            </h3>
            <form
              onSubmit={handleSubmit}
              className="space-y-3 max-h-[70vh] overflow-auto"
            >
              {/* Form fields */}
              {[
                { label: "No. KK", name: "no_kk", type: "text" },
                { label: "Nama KK", name: "nama_kk", type: "text" },
                { label: "Lindongan", name: "lindongan", type: "text" },
                { label: "Jumlah ART", name: "jumlah_art", type: "number" },
                {
                  label: "Status Bangunan",
                  name: "status_bangunan",
                  type: "text",
                },
                {
                  label: "Luas Bangunan (m²)",
                  name: "luas_bangunan",
                  type: "number",
                },
                { label: "Jenis Lantai", name: "jenis_lantai", type: "text" },
                { label: "Fasilitas MCK", name: "fasilitas_mck", type: "text" },
                {
                  label: "Sumber Air Minum",
                  name: "sumber_air_minum",
                  type: "text",
                },
                {
                  label: "Sumber Penerangan",
                  name: "sumber_penerangan",
                  type: "text",
                },
                { label: "Aset", name: "aset", type: "text" },
                {
                  label: "Penerima Bantuan",
                  name: "penerima_bantuan",
                  type: "text",
                },
                { label: "Lokasi (X)", name: "lokasi_x", type: "text" },
                { label: "Lokasi (Y)", name: "lokasi_y", type: "text" },
              ].map(({ label, name, type }) => (
                <div key={name} className="flex flex-col">
                  <label
                    htmlFor={name}
                    className="mb-1 font-medium text-gray-700 dark:text-gray-300"
                  >
                    {label}
                  </label>
                  <input
                    type={type}
                    id={name}
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    required={name === "no_kk" || name === "nama_kk"}
                    className="px-3 py-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    disabled={editingData && name === "no_kk"} // No. KK tidak bisa diubah saat edit
                  />
                </div>
              ))}

              <div className="flex justify-end mt-4 space-x-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
