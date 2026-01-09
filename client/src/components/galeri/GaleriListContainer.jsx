import React, { useEffect, useMemo, useState } from "react";
import api from "../../api/config";
import Toast from "../form/Toast";
import GaleriToolbar from "./GaleriToolbar";
import GaleriTable from "./GaleriTable";
import GaleriGrid from "./GaleriGrid";
import GaleriBulkActions from "./GaleriBulkActions";
import PaginationControls from "../PaginationControls";
import ConfirmDialog from "../ui/ConfirmDialog";

export default function GaleriListContainer() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  // UI state
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sortBy, setSortBy] = useState({ field: "date", dir: "desc" });
  const [view, setView] = useState("table");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(12);
  const [selected, setSelected] = useState(new Set());

  // confirm delete
  const [confirm, setConfirm] = useState({
    open: false,
    mode: null,
    targetId: null,
  });
  const [deleting, setDeleting] = useState(false);

  const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  /* ================= FETCH ================= */
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get("/galeri");
      setData(res.data || []);
    } catch {
      showToast("Gagal memuat data galeri", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* ================= TOAST ================= */
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false }), 3500);
  };

  /* ================= CATEGORIES ================= */
  const categories = useMemo(() => {
    const setC = new Set();
    data.forEach((d) => d.category && setC.add(d.category));
    return ["Semua", ...Array.from(setC)];
  }, [data]);

  /* ================= FILTER / SEARCH / SORT ================= */
  const processed = useMemo(() => {
    let list = [...data];

    if (categoryFilter && categoryFilter !== "Semua") {
      list = list.filter((i) => i.category === categoryFilter);
    }

    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (i) =>
          (i.title || "").toLowerCase().includes(q) ||
          (i.category || "").toLowerCase().includes(q) ||
          (i.author || "").toLowerCase().includes(q)
      );
    }

    const { field, dir } = sortBy;
    list.sort((a, b) => {
      const va = a[field] ?? "";
      const vb = b[field] ?? "";

      if (field === "date") {
        const da = va ? new Date(va).getTime() : 0;
        const db = vb ? new Date(vb).getTime() : 0;
        return dir === "asc" ? da - db : db - da;
      }

      if (String(va).toLowerCase() < String(vb).toLowerCase())
        return dir === "asc" ? -1 : 1;
      if (String(va).toLowerCase() > String(vb).toLowerCase())
        return dir === "asc" ? 1 : -1;
      return 0;
    });

    return list;
  }, [data, search, categoryFilter, sortBy]);

  /* ================= PAGINATION ================= */
  const total = processed.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages, page]);

  useEffect(() => {
    setPage(1);
  }, [search, categoryFilter, sortBy, perPage]);

  const currentItems = processed.slice((page - 1) * perPage, page * perPage);

  /* ================= SELECTION ================= */
  const toggleSelect = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const selectAllPage = () => {
    const ids = currentItems.map((i) => i.id);
    setSelected((prev) => {
      const next = new Set(prev);
      const allSelected = ids.every((id) => next.has(id));
      ids.forEach((id) => (allSelected ? next.delete(id) : next.add(id)));
      return next;
    });
  };

  const clearSelection = () => setSelected(new Set());

  /* ================= DELETE FLOW ================= */
  const requestDeleteOne = (id) => {
    setConfirm({ open: true, mode: "single", targetId: id });
  };

  const requestDeleteBulk = () => {
    if (!selected.size) return;
    setConfirm({ open: true, mode: "bulk", targetId: null });
  };

  const handleConfirmDelete = async () => {
    setDeleting(true);
    try {
      if (confirm.mode === "single") {
        await api.delete(`/galeri/${confirm.targetId}`);
        showToast("Galeri berhasil dihapus");
      }

      if (confirm.mode === "bulk") {
        await Promise.all(
          Array.from(selected).map((id) => api.delete(`/galeri/${id}`))
        );
        showToast("Galeri terpilih berhasil dihapus");
      }

      clearSelection();
      fetchData();
    } catch {
      showToast("Gagal menghapus galeri", "error");
    } finally {
      setDeleting(false);
      setConfirm({ open: false, mode: null, targetId: null });
    }
  };

  /* ================= RENDER ================= */
  return (
    <div>
      <Toast show={toast.show} message={toast.message} type={toast.type} />

      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Kelola Galeri</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manajemen foto dan dokumentasi
        </p>
      </div>

      <GaleriToolbar
        search={search}
        setSearch={setSearch}
        categories={categories}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
        view={view}
        setView={setView}
        perPage={perPage}
        setPerPage={setPerPage}
      />

      <ConfirmDialog
        open={confirm.open}
        title="Hapus Galeri"
        message={
          confirm.mode === "bulk"
            ? `Hapus ${selected.size} galeri terpilih?`
            : "Yakin ingin menghapus galeri ini?"
        }
        loading={deleting}
        onCancel={() => setConfirm({ open: false, mode: null, targetId: null })}
        onConfirm={handleConfirmDelete}
        variant="danger"
      />

      <div className="mt-4">
        {selected.size > 0 && (
          <GaleriBulkActions
            selectedCount={selected.size}
            onClear={clearSelection}
            onDelete={requestDeleteBulk}
          />
        )}

        {view === "table" ? (
          <GaleriTable
            loading={loading}
            items={currentItems}
            baseURL={baseURL}
            selected={selected}
            onToggleSelect={toggleSelect}
            onSelectAllPage={selectAllPage}
            allSelectedOnPage={currentItems.every((i) => selected.has(i.id))}
            onDelete={requestDeleteOne}
          />
        ) : (
          <GaleriGrid
            loading={loading}
            items={currentItems}
            baseURL={baseURL}
            onDelete={requestDeleteOne}
            onToggleSelect={toggleSelect}
            selected={selected}
          />
        )}

        <div className="flex justify-between mt-4">
          <span className="text-sm text-gray-500">
            Menampilkan <strong>{processed.length}</strong> data
          </span>

          <PaginationControls
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      </div>
    </div>
  );
}
