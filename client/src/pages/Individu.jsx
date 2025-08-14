import React, { useEffect, useState, useRef } from "react";
import api from "../api/config.js";
import { useNavigate } from "react-router-dom";
import IndividuTable from "../components/individu/IndividuTable.jsx";
import DeleteConfirmModal from "../components/DeleteConfirmModal.jsx";
import Notification from "../components/Notification.jsx";
import FilterControls from "../components/FilterControls.jsx";
import PaginationControls from "../components/PaginationControls.jsx";

export default function Individu() {
  const [individu, setIndividu] = useState([]);
  const [filteredIndividu, setFilteredIndividu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [filterLindongan, setFilterLindongan] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteConfirm, setDeleteConfirm] = useState({
    open: false,
    nik: null,
  });
  const fileInputRef = useRef(null);

  const itemsPerPage = 10;

  const navigate = useNavigate();

  // Fetch data keluarga dari API
  const fetchIndividu = async () => {
    setLoading(true);
    try {
      const res = await api.get("/individu");
      setIndividu(res.data);
    } catch (err) {
      setError("Gagal memuat data individu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIndividu();
  }, []);

  // Filtering data berdasarkan lindongan dan searchTerm
  useEffect(() => {
    let data = individu;

    if (filterLindongan) {
      data = data.filter((item) => item.lindongan === filterLindongan);
    }

    if (searchTerm.trim() !== "") {
      const lowerSearch = searchTerm.toLowerCase();
      data = data.filter(
        (item) =>
          (item.nik && item.nik.toLowerCase().includes(lowerSearch)) ||
          (item.nama && item.nama.toLowerCase().includes(lowerSearch)) ||
          (item.no_kk && item.no_kk.toLowerCase().includes(lowerSearch))
      );
    }

    setFilteredIndividu(data);
    setCurrentPage(1);
  }, [filterLindongan, searchTerm, individu]);

  // Pagination
  const totalPages = Math.ceil(filteredIndividu.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredIndividu.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Navigasi edit dan tambah
  const handleEdit = (nik) =>
    navigate(`/dashboard/penduduk/individu/edit/${nik}`);
  const handleAdd = () => navigate("/dashboard/penduduk/individu/add");

  const confirmDelete = (nik) => setDeleteConfirm({ open: true, nik });
  const cancelDelete = () => setDeleteConfirm({ open: false, nik: null });

  const handleDelete = async () => {
    if (!deleteConfirm.nik) return;
    setLoading(true);
    try {
      await api.delete(`/individu/${deleteConfirm.nik}`);
      setSuccessMessage("Data berhasil dihapus.");
      fetchIndividu();
    } catch {
      setError("Gagal menghapus data.");
    } finally {
      setLoading(false);
      setDeleteConfirm({ open: false, nik: null });
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
      const res = await api.post("/individu/import", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      let baseMessage = `Import selesai — ${res.data.sukses} data berhasil, ${res.data.gagal} data gagal.`;
      let extraMessages = [];

      // Kalau ada file gagal, kita cek isinya
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
                "Beberapa data diabaikan karena NIK sudah terdaftar."
              );
            }
            if (
              failedData.some((item) =>
                item.error_message?.includes("foreign key constraint")
              )
            ) {
              extraMessages.push(
                "Beberapa data gagal diimport karena No KK belum terdaftar di sistem."
              );
            }
            if (
              failedData.some(
                (item) =>
                  !item.error_message?.includes("Duplicate entry") &&
                  !item.error_message?.includes("foreign key constraint")
              )
            ) {
              extraMessages.push(
                "Sebagian data gagal diimport karena format atau isi data tidak valid."
              );
            }
          }
        } catch (err) {
          console.warn("Gagal membaca file gagal:", err);
        }
      }

      // Tampilkan pesan aman
      if (res.data.gagal && res.data.gagal > 0) {
        setSuccessMessage(
          baseMessage +
            (extraMessages.length ? " " + extraMessages.join(" ") : "")
        );
        setError(
          `Ada ${
            res.data.gagal
          } data yang gagal diimport. Silakan periksa file ${
            res.data.file_gagal || "import_gagal.json"
          } untuk detailnya.`
        );
      } else {
        setSuccessMessage("Import data berhasil!");
      }

      fetchIndividu();
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      // Mapping error supaya aman
      let userFriendlyError = "Terjadi kesalahan saat mengimport data.";
      if (err.response?.status === 413) {
        userFriendlyError =
          "File terlalu besar. Maksimal ukuran file adalah 5MB.";
      } else if (
        err.response?.data?.message?.includes("Unsupported file type")
      ) {
        userFriendlyError =
          "Format file tidak didukung. Gunakan file Excel (.xlsx).";
      }

      setError(userFriendlyError);
    } finally {
      setLoading(false);
      setTimeout(() => {
        setSuccessMessage(null);
        setError(null);
      }, 5000);
    }
  };

  const lindonganOptions = Array.from(
    new Set(individu.map((item) => item.lindongan))
  ).filter(Boolean);

  if (loading) return <p className="py-4 text-center">Loading data...</p>;

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
        id={deleteConfirm.nik}
        desk={" dengan NIK"}
        onCancel={cancelDelete}
        onConfirm={handleDelete}
      />

      <div className="flex flex-col gap-3 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-semibold">Data Individu</h2>

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
      <div className="overflow-x-auto border border-gray-300 rounded-lg dark:border-gray-700">
        <table className="w-full text-sm border-collapse table-auto dark:text-gray-100">
          <thead className="text-xs text-gray-600 uppercase border-b border-gray-300 dark:text-gray-400 dark:border-gray-700">
            <tr>
              <th className="px-4 py-2">NIK</th>
              <th className="px-4 py-2">No KK</th>
              <th className="px-4 py-2">Nama</th>
              <th className="px-4 py-2">Lindongan</th>
              <th className="px-4 py-2">Jenis Kelamin</th>
              <th className="px-4 py-2">Usia</th>
              <th className="px-4 py-2">Tanggal Lahir</th>
              <th className="px-4 py-2">Status Pernikahan</th>
              <th className="px-4 py-2">Agama</th>
              <th className="px-4 py-2">Warga Negara</th>
              <th className="px-4 py-2">Akta Kelahiran</th>
              <th className="px-4 py-2">Ijazah Terakhir</th>
              <th className="px-4 py-2">Kegiatan Utama</th>
              <th className="px-4 py-2">PIP</th>
              <th className="px-4 py-2">Deskripsi Pekerjaan</th>
              <th className="px-4 py-2">Pekerjaan Utama</th>
              <th className="px-4 py-2">Status Pekerjaan</th>
              <th className="px-4 py-2">Pendapatan</th>
              <th className="px-4 py-2">Jaminan Kesehatan</th>
              <th className="px-4 py-2">Disabilitas</th>
              <th className="px-4 py-2">Penyakit</th>
              <th className="px-4 py-2">Rawat Jalan</th>
              <th className="px-4 py-2">Kali Rawat Jalan</th>
              <th className="px-4 py-2">Tempat Rawat Jalan</th>
              <th className="px-4 py-2">Rawat Inap</th>
              <th className="px-4 py-2">Kali Rawat Inap</th>
              <th className="px-4 py-2">Tempat Rawat Inap</th>
              <th className="px-4 py-2">Catatan</th>
              <th className="px-4 py-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <IndividuTable
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
