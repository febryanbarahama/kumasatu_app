import React, { useEffect, useState } from "react";
import api from "../api/config.js";
import { useNavigate } from "react-router-dom";
import IndividuTable from "../components/individu/IndividuTable.jsx";

export default function Individu() {
  const [individu, setIndividu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({
    open: false,
    nik: null,
  });

  const navigate = useNavigate();

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

  // Navigasi edit dan tambah
  const handleEdit = (nik) =>
    navigate(`/dashboard/penduduk/individu/edit/${nik}`);
  const handleAdd = () => navigate("/dashboard/penduduk/individu/add");

  const handleDelete = async () => {
    if (!deleteConfirm.nik) return;
    setLoading(true);
    try {
      await api.delete(`/individu/${deleteConfirm.nik}`);
      setSuccessMessage("Data berhasil dihapus.");
      fetchKeluarga();
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

  if (loading) return <p className="py-4 text-center">Loading data...</p>;

  return (
    <div className="relative w-full">
      <div className="flex flex-col gap-3 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-semibold">Data Individu</h2>
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
              data={individu}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </tbody>
        </table>
      </div>
    </div>
  );
}
