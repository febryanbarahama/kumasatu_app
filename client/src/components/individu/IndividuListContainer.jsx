import React, { useEffect, useMemo, useRef, useState } from "react";
import api from "../../api/config.js";
import Notification from "../Notification.jsx";
import FilterControls from "../FilterControls.jsx";
import PaginationControls from "../PaginationControls.jsx";
import IndividuTable from "./IndividuTable.jsx";
import IndividuBulkActions from "./IndividuBulkActions.jsx";
import ConfirmDialog from "../ui/ConfirmDialog.jsx";

export default function IndividuListContainer() {
  const [individu, setIndividu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // UI state
  const [filterLindongan, setFilterLindongan] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [selected, setSelected] = useState(new Set());

  // confirm dialog state
  const [confirm, setConfirm] = useState({
    open: false,
    mode: null,
    targetNik: null,
  });
  const [deleting, setDeleting] = useState(false);

  const fileInputRef = useRef(null);

  const fetchIndividu = async () => {
    setLoading(true);
    try {
      const res = await api.get("/individu");
      setIndividu(res.data || []);
      setError(null);
    } catch {
      setError("Gagal memuat data individu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Individu - Admin Kampung Kuma I";
    fetchIndividu();
  }, []);

  // filtering
  const filtered = useMemo(() => {
    let data = [...individu];
    if (filterLindongan) {
      data = data.filter((i) => i.lindongan === filterLindongan);
    }

    const q = searchTerm.trim().toLowerCase();
    if (q) {
      data = data.filter(
        (i) =>
          (i.nik || "").toLowerCase().includes(q) ||
          (i.nama || "").toLowerCase().includes(q) ||
          (i.no_kk || "").toLowerCase().includes(q)
      );
    }
    return data;
  }, [individu, filterLindongan, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [totalPages, currentPage]);

  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * perPage;
    return filtered.slice(start, start + perPage);
  }, [filtered, currentPage, perPage]);

  // selection helpers
  const toggleSelect = (nik) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(nik) ? next.delete(nik) : next.add(nik);
      return next;
    });
  };

  const selectAllPage = () => {
    const ids = currentItems.map((i) => i.nik);
    setSelected((prev) => {
      const next = new Set(prev);
      const allSelected = ids.every((id) => next.has(id));
      ids.forEach((id) => (allSelected ? next.delete(id) : next.add(id)));
      return next;
    });
  };

  const clearSelection = () => setSelected(new Set());

  // delete handler (single + bulk)
  const handleConfirmDelete = async () => {
    setDeleting(true);
    try {
      if (confirm.mode === "single" && confirm.targetNik) {
        await api.delete(`/individu/${confirm.targetNik}`);
        setSuccessMessage(
          `Individu dengan NIK ${confirm.targetNik} berhasil dihapus.`
        );
      }

      if (confirm.mode === "bulk") {
        await Promise.all(
          Array.from(selected).map((nik) => api.delete(`/individu/${nik}`))
        );
        setSuccessMessage(`${selected.size} individu berhasil dihapus.`);
      }

      clearSelection();
      await fetchIndividu();
    } catch {
      setError("Gagal menghapus data.");
    } finally {
      setDeleting(false);
      setConfirm({ open: false, mode: null, targetNik: null });
      setTimeout(() => {
        setSuccessMessage(null);
        setError(null);
      }, 3500);
    }
  };

  // import excel (UNCHANGED)
  const handleImportExcel = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    try {
      await api.post("/individu/import", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccessMessage("Import data berhasil!");
      fetchIndividu();
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch {
      setError("Gagal mengimport data.");
    } finally {
      setLoading(false);
    }
  };

  const lindonganOptions = useMemo(
    () => Array.from(new Set(individu.map((i) => i.lindongan))).filter(Boolean),
    [individu]
  );

  if (loading) return <p className="py-4 text-center">Loading data...</p>;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Data Individu</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manajemen data penduduk individu
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
            (window.location.href = "/dashboard/penduduk/individu/add")
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

      <IndividuBulkActions
        selectedCount={selected.size}
        onClear={clearSelection}
        onDelete={() =>
          setConfirm({ open: true, mode: "bulk", targetNik: null })
        }
      />

      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-3 py-2">
                <input
                  type="checkbox"
                  checked={
                    currentItems.length > 0 &&
                    currentItems.every((i) => selected.has(i.nik))
                  }
                  onChange={selectAllPage}
                />
              </th>
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
              onEdit={(nik) =>
                (window.location.href = `/dashboard/penduduk/individu/edit/${nik}`)
              }
              onDelete={(nik) =>
                setConfirm({ open: true, mode: "single", targetNik: nik })
              }
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
        title="Hapus Data Individu"
        message={
          confirm.mode === "bulk"
            ? `Hapus ${selected.size} individu terpilih?`
            : `Yakin ingin menghapus individu dengan NIK ${confirm.targetNik}?`
        }
        loading={deleting}
        onCancel={() =>
          setConfirm({ open: false, mode: null, targetNik: null })
        }
        onConfirm={handleConfirmDelete}
        variant="danger"
      />
    </div>
  );
}
