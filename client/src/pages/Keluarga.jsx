import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/config.js";

import DeleteConfirmModal from "../components/DeleteConfirmModal.jsx";
import Notification from "../components/Notification.jsx";
import FilterControls from "../components/FilterControls.jsx";
import KeluargaTable from "../components/keluarga/KeluargaTable.jsx";
import PaginationControls from "../components/PaginationControls.jsx";

export default function Keluarga() {
  const [keluarga, setKeluarga] = useState([]);
  const [filteredKeluarga, setFilteredKeluarga] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [filterLindongan, setFilterLindongan] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteConfirm, setDeleteConfirm] = useState({
    open: false,
    no_kk: null,
  });
  const fileInputRef = useRef(null);

  const itemsPerPage = 10;
  const navigate = useNavigate();

  // Fetch data keluarga dari API
  const fetchKeluarga = async () => {
    setLoading(true);
    try {
      const res = await api.get("/keluarga");
      setKeluarga(res.data);
      setFilteredKeluarga(res.data);
      setError(null);
    } catch (err) {
      setError("Gagal memuat data keluarga.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKeluarga();
  }, []);

  // Filtering data berdasarkan lindongan dan searchTerm
  useEffect(() => {
    let data = keluarga;

    if (filterLindongan) {
      data = data.filter((item) => item.lindongan === filterLindongan);
    }

    if (searchTerm.trim() !== "") {
      const lowerSearch = searchTerm.toLowerCase();
      data = data.filter(
        (item) =>
          (item.no_kk && item.no_kk.toLowerCase().includes(lowerSearch)) ||
          (item.nama_kk && item.nama_kk.toLowerCase().includes(lowerSearch)) ||
          (item.nik_kk && item.nik_kk.toLowerCase().includes(lowerSearch))
      );
    }

    setFilteredKeluarga(data);
    setCurrentPage(1);
  }, [filterLindongan, searchTerm, keluarga]);

  // Pagination
  const totalPages = Math.ceil(filteredKeluarga.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredKeluarga.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Navigasi edit dan tambah
  const handleEdit = (no_kk) =>
    navigate(`/dashboard/penduduk/keluarga/edit/${no_kk}`);
  const handleAdd = () => navigate("/dashboard/penduduk/keluarga/add");

  // Modal hapus
  const confirmDelete = (no_kk) => setDeleteConfirm({ open: true, no_kk });
  const cancelDelete = () => setDeleteConfirm({ open: false, no_kk: null });

  const handleDelete = async () => {
    if (!deleteConfirm.no_kk) return;
    setLoading(true);
    try {
      await api.delete(`/keluarga/${deleteConfirm.no_kk}`);
      setSuccessMessage("Data berhasil dihapus.");
      fetchKeluarga();
    } catch {
      setError("Gagal menghapus data.");
    } finally {
      setLoading(false);
      setDeleteConfirm({ open: false, no_kk: null });
      setTimeout(() => {
        setSuccessMessage(null);
        setError(null);
      }, 3000);
    }
  };

  // Import Excel
  const handleImportExcel = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    try {
      const res = await api.post("/keluarga/import", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      let baseMessage = `Import selesai — ${res.data.sukses} data berhasil, ${res.data.gagal} data gagal.`;
      let extraMessages = [];

      // Kalau ada file gagal, baca isinya
      if (res.data.file_gagal) {
        try {
          const failRes = await api.get(`/${res.data.file_gagal}`);
          const failedData = failRes.data;

          if (Array.isArray(failedData)) {
            if (
              failedData.some((item) =>
                item.error_message?.includes("Duplicate entry")
              )
            ) {
              extraMessages.push(
                "Beberapa data tidak diimport karena No KK sudah ada."
              );
            }
            if (
              failedData.some((item) =>
                item.error_message?.includes("Incorrect enum value")
              )
            ) {
              extraMessages.push(
                "Beberapa data tidak diimport karena nilai ENUM tidak valid."
              );
            }
          }
        } catch (err) {
          console.warn("Gagal membaca file gagal:", err);
        }
      }

      // Tampilkan pesan
      if (res.data.gagal && res.data.gagal > 0) {
        setSuccessMessage(
          baseMessage +
            (extraMessages.length ? " " + extraMessages.join(" ") : "")
        );
        setError(
          `Ada ${res.data.gagal} data yang gagal diimport. Cek file ${
            res.data.file_gagal || "import_gagal.json"
          } di server.`
        );
      } else {
        setSuccessMessage("Import data berhasil!");
      }

      fetchKeluarga();
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      setError(
        "Gagal import data: " + (err.response?.data?.message || err.message)
      );
    } finally {
      setLoading(false);
      setTimeout(() => {
        setSuccessMessage(null);
        setError(null);
      }, 5000);
    }
  };

  const lindonganOptions = Array.from(
    new Set(keluarga.map((item) => item.lindongan))
  ).filter(Boolean);

  if (loading)
    return (
      <p className="mt-8 text-center text-gray-700 dark:text-gray-300">
        Loading data keluarga...
      </p>
    );

  return (
    <div className="relative w-full">
      {/* Pesan sukses dan error */}
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

      {/* Modal konfirmasi hapus */}
      <DeleteConfirmModal
        open={deleteConfirm.open}
        id={deleteConfirm.no_kk}
        desk={" dengan No.KK"}
        onCancel={cancelDelete}
        onConfirm={handleDelete}
      />

      {/* Header & Controls */}
      <div className="flex flex-col gap-3 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-semibold">Data Keluarga</h2>

        <FilterControls
          filterLindongan={filterLindongan}
          setFilterLindongan={setFilterLindongan}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          lindonganOptions={lindonganOptions}
          onAdd={handleAdd}
          onImportChange={handleImportExcel}
          fileInputRef={fileInputRef}
        />
      </div>

      {/* Tabel dan Pagination */}
      <div
        className="overflow-x-auto border border-gray-300 rounded-lg dark:border-gray-700"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#9CA3AF #E5E7EB",
        }}
      >
        <table className="w-full text-sm border-collapse table-auto dark:text-gray-100">
          <thead className="text-xs text-gray-600 uppercase border-b border-gray-300 dark:text-gray-400 dark:border-gray-700">
            <tr>
              <th className="px-4 py-2">No KK</th>
              <th className="px-4 py-2">Nama KK</th>
              <th className="px-4 py-2">NIK KK</th>
              <th className="px-4 py-2">JK KK</th>
              <th className="px-4 py-2">Lindongan</th>
              <th className="px-4 py-2">Jumlah ART</th>
              <th className="px-4 py-2">Status Bangunan</th>
              <th className="px-4 py-2">Status Kepemilikan Tanah</th>
              <th className="px-4 py-2">Luas Bangunan</th>
              <th className="px-4 py-2">Luas Tanah</th>
              <th className="px-4 py-2">Jenis Lantai</th>
              <th className="px-4 py-2">Jenis Dinding</th>
              <th className="px-4 py-2">Jenis Atap</th>
              <th className="px-4 py-2">Fasilitas MCK</th>
              <th className="px-4 py-2">Tempat Pembuangan Tinja</th>
              <th className="px-4 py-2">Sumber Air Minum</th>
              <th className="px-4 py-2">Sumber Air Mandi</th>
              <th className="px-4 py-2">Sumber Penerangan</th>
              <th className="px-4 py-2">Daya Listrik</th>
              <th className="px-4 py-2">Bahan Bakar Memasak</th>
              <th className="px-4 py-2">Aset</th>
              <th className="px-4 py-2">Tanah Lain</th>
              <th className="px-4 py-2">Penerima Bantuan</th>
              <th className="px-4 py-2">Jenis Bantuan</th>
              <th className="px-4 py-2">Lokasi X</th>
              <th className="px-4 py-2">Lokasi Y</th>
              <th className="px-4 py-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <KeluargaTable
              data={currentItems}
              onEdit={handleEdit}
              onDelete={confirmDelete}
            />
          </tbody>
        </table>
      </div>

      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
