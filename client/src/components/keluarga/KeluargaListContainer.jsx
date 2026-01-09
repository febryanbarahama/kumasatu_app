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

  // UI state
  const [filterLindongan, setFilterLindongan] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [selected, setSelected] = useState(new Set());

  // confirm dialog
  const [confirm, setConfirm] = useState({
    open: false,
    mode: null,
    payload: null,
  });

  const [deleting, setDeleting] = useState(false);

  const fileInputRef = useRef(null);

  const fetchKeluarga = async () => {
    setLoading(true);
    try {
      const res = await api.get("/keluarga");
      setKeluarga(res.data || []);
      setError(null);
    } catch {
      setError("Gagal memuat data keluarga.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Keluarga - Admin Kampung Kuma I";
    fetchKeluarga();
  }, []);

  // filtering
  const filtered = useMemo(() => {
    let data = [...keluarga];
    if (filterLindongan)
      data = data.filter((it) => it.lindongan === filterLindongan);

    const q = (searchTerm || "").trim().toLowerCase();
    if (q) {
      data = data.filter(
        (item) =>
          (item.no_kk || "").toLowerCase().includes(q) ||
          (item.nama_kk || "").toLowerCase().includes(q) ||
          (item.nik_kk || "").toLowerCase().includes(q)
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

  // selection
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
      const all = ids.every((id) => next.has(id));
      ids.forEach((id) => (all ? next.delete(id) : next.add(id)));
      return next;
    });
  };

  const clearSelection = () => setSelected(new Set());

  // ===== DELETE HANDLERS (TIDAK DIUBAH, HANYA DIPANGGIL DARI CONFIRM) =====

  const handleDeleteSingle = async (no_kk) => {
    setLoading(true);
    try {
      await api.delete(`/keluarga/${no_kk}`);
      setSuccessMessage("Data keluarga berhasil dihapus.");
      await fetchKeluarga();
      clearSelection();
    } catch {
      setError("Gagal menghapus data.");
    } finally {
      setLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    setLoading(true);
    try {
      await Promise.all(
        Array.from(selected).map((id) => api.delete(`/keluarga/${id}`))
      );
      setSuccessMessage("Data terpilih berhasil dihapus.");
      await fetchKeluarga();
      clearSelection();
    } catch {
      setError("Gagal menghapus beberapa data.");
    } finally {
      setLoading(false);
    }
  };

  // ===== OPEN CONFIRM =====

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
    if (selected.size === 0) return;
    setConfirm({
      open: true,
      mode: "bulk",
      payload: { count: selected.size },
    });
  };

  const handleConfirm = async () => {
    if (confirm.mode === "single") {
      await handleDeleteSingle(confirm.payload.no_kk);
    } else if (confirm.mode === "bulk") {
      await handleBulkDelete();
    }

    setConfirm({ open: false, mode: null, payload: null });
    setTimeout(() => {
      setSuccessMessage(null);
      setError(null);
    }, 3000);
  };

  // import excel (AS-IS, TIDAK DIUBAH)
  const handleImportExcel = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    setLoading(true);

    try {
      await api.post("/keluarga/import", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccessMessage("Import data berhasil!");
      await fetchKeluarga();
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      setError("Gagal import data.");
    } finally {
      setLoading(false);
    }
  };

  const lindonganOptions = useMemo(
    () => Array.from(new Set(keluarga.map((i) => i.lindongan))).filter(Boolean),
    [keluarga]
  );

  if (loading)
    return (
      <p className="mt-8 text-center text-gray-700 dark:text-gray-300">
        Loading data keluarga...
      </p>
    );

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
              className="px-2 py-1 ml-2 border rounded dark:bg-gray-700 dark:text-gray-100"
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

      <div
        className="overflow-x-auto border border-gray-300 rounded-lg dark:border-gray-700"
        style={{ scrollbarWidth: "thin", scrollbarColor: "#9CA3AF #E5E7EB" }}
      >
        <table className="w-full text-sm border-collapse table-auto dark:text-gray-100">
          <thead className="text-xs text-black uppercase bg-gray-100 border-b dark:text-white dark:bg-gray-700">
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
              onEdit={(no_kk) =>
                (window.location.href = `/dashboard/penduduk/keluarga/edit/${no_kk}`)
              }
              onDelete={confirmDeleteSingle}
              selected={selected}
              onToggleSelect={toggleSelect}
              onSelectAllPage={selectAllPage}
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
            ? `Hapus keluarga dengan No KK ${confirm.payload?.no_kk} (${confirm.payload?.nama_kk})?`
            : `Hapus ${confirm.payload?.count} data keluarga terpilih?`
        }
        confirmText="Hapus"
        confirmVariant="danger"
        loading={deleting}
        onCancel={() => setConfirm({ open: false, mode: null, payload: null })}
        onConfirm={handleConfirm}
        variant="danger"
      />
    </div>
  );
}
