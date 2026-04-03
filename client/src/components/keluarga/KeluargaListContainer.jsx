import React, { useEffect, useMemo, useState, useRef } from "react";
import api from "../../api/config.js";
import Notification from "../Notification.jsx";
import ConfirmDialog from "../../components/ui/ConfirmDialog.jsx";
import FilterControls from "../FilterControls.jsx";
import KeluargaTable from "./KeluargaTable.jsx";
import PaginationControls from "../PaginationControls.jsx";
import KeluargaBulkActions from "./KeluargaBulkActions.jsx";

export default function KeluargaListContainer() {
  const [keluarga, setKeluarga] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const [filterLindongan, setFilterLindongan] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [selected, setSelected] = useState(new Set());

  const [confirm, setConfirm] = useState({
    open: false,
    mode: null,
    payload: null,
  });

  const [deleting, setDeleting] = useState(false);

  const fileInputRef = useRef(null);

  /* =========================
     FETCH DATA (IMPROVED)
  ========================= */
  const fetchKeluarga = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/keluarga");

      // smooth loading (anti flicker)
      setTimeout(() => {
        setKeluarga(res.data || []);
        setError(null);
        setLoading(false);
      }, 300);
    } catch {
      setError("Gagal memuat data keluarga.");
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Keluarga - Admin Kampung Kuma I";
    fetchKeluarga();
  }, []);

  /* =========================
     FILTERING
  ========================= */
  const filtered = useMemo(() => {
    let data = [...keluarga];

    if (filterLindongan) {
      data = data.filter((it) => it.lindongan === filterLindongan);
    }

    const q = (searchTerm || "").trim().toLowerCase();

    if (q) {
      data = data.filter(
        (item) =>
          (item.no_kk || "").toLowerCase().includes(q) ||
          (item.nama_kk || "").toLowerCase().includes(q) ||
          (item.nik_kk || "").toLowerCase().includes(q),
      );
    }

    return data;
  }, [keluarga, filterLindongan, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [totalPages, currentPage]);

  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * perPage;
    return filtered.slice(start, start + perPage);
  }, [filtered, currentPage, perPage]);

  /* =========================
     SELECTION
  ========================= */
  const toggleSelect = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const selectAllPage = () => {
    const ids = currentItems.map((i) => i.no_kk);

    setSelected((prev) => {
      const next = new Set(prev);
      const allSelected = ids.every((id) => next.has(id));

      ids.forEach((id) => (allSelected ? next.delete(id) : next.add(id)));

      return next;
    });
  };

  const clearSelection = () => setSelected(new Set());

  /* =========================
     DELETE
  ========================= */
  const handleDeleteSingle = async (no_kk) => {
    setDeleting(true);
    try {
      await api.delete(`/api/keluarga/${no_kk}`);
      setSuccessMessage("Data keluarga berhasil dihapus.");
      await fetchKeluarga();
      clearSelection();
    } catch {
      setError("Gagal menghapus data.");
    } finally {
      setDeleting(false);
    }
  };

  const handleBulkDelete = async () => {
    setDeleting(true);
    try {
      await Promise.all(
        Array.from(selected).map((id) => api.delete(`/api/keluarga/${id}`)),
      );
      setSuccessMessage("Data terpilih berhasil dihapus.");
      await fetchKeluarga();
      clearSelection();
    } catch {
      setError("Gagal menghapus beberapa data.");
    } finally {
      setDeleting(false);
    }
  };

  const confirmDeleteSingle = (no_kk) => {
    const item = keluarga.find((k) => k.no_kk === no_kk);

    setConfirm({
      open: true,
      mode: "single",
      payload: {
        no_kk,
        nama_kk: item?.nama_kk || "-",
      },
    });
  };

  const confirmDeleteBulk = () => {
    if (!selected.size) return;

    setConfirm({
      open: true,
      mode: "bulk",
      payload: { count: selected.size },
    });
  };

  const handleConfirm = async () => {
    if (confirm.mode === "single") {
      await handleDeleteSingle(confirm.payload.no_kk);
    } else {
      await handleBulkDelete();
    }

    setConfirm({ open: false, mode: null, payload: null });

    setTimeout(() => {
      setSuccessMessage(null);
      setError(null);
    }, 3000);
  };

  /* =========================
     IMPORT
  ========================= */
  const handleImportExcel = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);

    try {
      await api.post("/api/keluarga/import", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccessMessage("Import data berhasil!");
      await fetchKeluarga();

      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch {
      setError("Gagal import data.");
    } finally {
      setLoading(false);
    }
  };

  const lindonganOptions = useMemo(
    () => Array.from(new Set(keluarga.map((i) => i.lindongan))).filter(Boolean),
    [keluarga],
  );

  /* =========================
     RENDER
  ========================= */
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Data Keluarga</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manajemen data penduduk keluarga
        </p>
      </div>

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

      <div className="flex items-center justify-between mb-4">
        <FilterControls
          filterLindongan={filterLindongan}
          setFilterLindongan={setFilterLindongan}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          lindonganOptions={lindonganOptions}
          onAdd={() =>
            (window.location.href = "/dashboard/penduduk/keluarga/add")
          }
          onImportChange={handleImportExcel}
          fileInputRef={fileInputRef}
        />

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2">
            <span className="text-sm">Per halaman</span>
            <select
              value={perPage}
              onChange={(e) => setPerPage(Number(e.target.value))}
              className="px-2 py-1 border rounded dark:bg-gray-700 dark:text-gray-100"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </label>
        </div>
      </div>

      <KeluargaBulkActions
        selectedCount={selected.size}
        onClear={clearSelection}
        onDelete={confirmDeleteBulk}
      />

      <div className="overflow-x-auto border rounded-lg dark:border-gray-700">
        <table className="w-full text-sm border-collapse table-auto dark:text-gray-100">
          <thead className="text-xs uppercase bg-gray-100 border-b dark:bg-gray-700">
            <tr>
              <th className="px-4 py-2">
                <input
                  type="checkbox"
                  checked={
                    currentItems.length > 0 &&
                    currentItems.every((i) => selected.has(i.no_kk))
                  }
                  onChange={selectAllPage}
                />
              </th>

              {[
                "No KK",
                "Nama KK",
                "NIK KK",
                "JK KK",
                "Lindongan",
                "Jumlah ART",
                "Status Bangunan",
                "Status Kepemilikan Tanah",
                "Luas Bangunan",
                "Luas Tanah",
                "Jenis Lantai",
                "Jenis Dinding",
                "Jenis Atap",
                "Fasilitas MCK",
                "Tempat Pembuangan Tinja",
                "Sumber Air Minum",
                "Sumber Air Mandi",
                "Sumber Penerangan",
                "Daya Listrik",
                "Bahan Bakar Memasak",
                "Aset",
                "Tanah Lain",
                "Penerima Bantuan",
                "Jenis Bantuan",
                "Lokasi X",
                "Lokasi Y",
                "Aksi",
              ].map((h, i) => (
                <th key={i} className="px-4 py-2">
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            <KeluargaTable
              data={currentItems}
              loading={loading} // 🔥 INI KUNCI
              onEdit={(no_kk) =>
                (window.location.href = `/dashboard/penduduk/keluarga/edit/${no_kk}`)
              }
              onDelete={confirmDeleteSingle}
              selected={selected}
              onToggleSelect={toggleSelect}
            />
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Menampilkan <strong>{filtered.length}</strong> hasil
        </div>

        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      <ConfirmDialog
        open={confirm.open}
        title="Konfirmasi Hapus"
        message={
          confirm.mode === "single"
            ? `Hapus keluarga ${confirm.payload?.no_kk}?`
            : `Hapus ${confirm.payload?.count} data?`
        }
        confirmText="Hapus"
        confirmVariant="danger"
        loading={deleting}
        onCancel={() => setConfirm({ open: false, mode: null, payload: null })}
        onConfirm={handleConfirm}
      />
    </div>
  );
}
