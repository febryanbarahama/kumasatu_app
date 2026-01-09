import React, { useEffect, useMemo, useState } from "react";
import api from "../../api/config.js";
import Toast from "../form/Toast.jsx";
import PaginationControls from "../PaginationControls.jsx";
import ConfirmDialog from "../ui/ConfirmDialog.jsx";
import PengaduanTable from "./PengaduanTable.jsx";
import PengaduanToolbar from "./PengaduanToollbar.jsx";
import PengaduanBulkActions from "./PengaduanBulkActions.jsx";
import PengaduanDetailModal from "./PengaduanDetailModal.jsx";

export default function PengaduanListContainer() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  /* ================= UI STATE ================= */
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState({ field: "created_at", dir: "desc" });
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [selected, setSelected] = useState(new Set());

  /* ================= DETAIL MODAL ================= */
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailData, setDetailData] = useState(null);

  /* ================= CONFIRM ================= */
  const [confirm, setConfirm] = useState({
    open: false,
    mode: null,
    action: null,
    targetId: null,
  });

  const [processing, setProcessing] = useState(false);

  /* ================= FETCH ================= */
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get("/pengaduan");
      setData(res.data || []);
    } catch {
      showToast("Gagal mengambil data pengaduan", "error");
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

  /* ================= FILTER / SORT ================= */
  const statuses = ["Semua", "menunggu", "diproses", "selesai"];

  const processed = useMemo(() => {
    let list = [...data];

    if (statusFilter && statusFilter !== "Semua") {
      list = list.filter((i) => i.status === statusFilter);
    }

    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (i) =>
          (i.nama || "").toLowerCase().includes(q) ||
          (i.nik || "").includes(q) ||
          (i.judul_pengaduan || "").toLowerCase().includes(q)
      );
    }

    const { field, dir } = sortBy;
    list.sort((a, b) => {
      const va = a[field] ?? "";
      const vb = b[field] ?? "";

      if (field.includes("tanggal") || field.includes("created")) {
        return dir === "asc"
          ? new Date(va) - new Date(vb)
          : new Date(vb) - new Date(va);
      }

      return dir === "asc"
        ? String(va).localeCompare(String(vb))
        : String(vb).localeCompare(String(va));
    });

    return list;
  }, [data, search, statusFilter, sortBy]);

  /* ================= PAGINATION ================= */
  const totalPages = Math.max(1, Math.ceil(processed.length / perPage));

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, sortBy, perPage]);

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

  /* ================= DETAIL ================= */
  const handleViewDetail = (item) => {
    setDetailData(item);
    setDetailOpen(true);
  };

  /* ================= STATUS FLOW ================= */
  const requestStatusChange = (action, id = null) => {
    setConfirm({
      open: true,
      mode: id ? "single" : "bulk",
      action,
      targetId: id,
    });
  };

  const handleConfirmStatus = async () => {
    setProcessing(true);
    try {
      const ids =
        confirm.mode === "single" ? [confirm.targetId] : Array.from(selected);

      await Promise.all(
        ids.map((id) =>
          api.put(`/pengaduan/${id}`, {
            status: confirm.action,
          })
        )
      );

      showToast("Status pengaduan berhasil diperbarui");
      clearSelection();
      fetchData();
    } catch (error) {
      console.error(error);
      showToast("Gagal memperbarui status pengaduan", "error");
    } finally {
      setProcessing(false);
      setConfirm({ open: false, mode: null, action: null, targetId: null });
    }
  };

  /* ================= RENDER ================= */
  return (
    <div>
      <Toast {...toast} />

      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Pengaduan Masyarakat</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Daftar pengaduan yang masuk dari masyarakat
        </p>
      </div>

      <PengaduanToolbar
        search={search}
        setSearch={setSearch}
        statuses={statuses}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
        perPage={perPage}
        setPerPage={setPerPage}
      />

      {/* BULK ACTIONS */}
      {selected.size > 0 && (
        <PengaduanBulkActions
          selectedCount={selected.size}
          onClear={clearSelection}
          onMarkWait={() => requestStatusChange("menunggu")}
          onMarkProcess={() => requestStatusChange("diproses")}
          onMarkDone={() => requestStatusChange("selesai")}
        />
      )}

      {/* TABLE */}
      <PengaduanTable
        loading={loading}
        items={currentItems}
        selected={selected}
        onToggleSelect={toggleSelect}
        onSelectAllPage={selectAllPage}
        allSelectedOnPage={currentItems.every((i) => selected.has(i.id))}
        onViewDetail={handleViewDetail}
        onMarkWait={(id) => requestStatusChange("menunggu", id)}
        onMarkProcessing={(id) => requestStatusChange("diproses", id)}
        onMarkDone={(id) => requestStatusChange("selesai", id)}
      />

      {/* PAGINATION */}
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Total <strong>{processed.length}</strong> data
        </div>
        <PaginationControls
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>

      {/* CONFIRM */}
      <ConfirmDialog
        open={confirm.open}
        title="Konfirmasi Perubahan Status"
        message={`Yakin ingin mengubah status menjadi "${confirm.action}"?`}
        confirmText="Ya, lanjutkan"
        loading={processing}
        onCancel={() =>
          setConfirm({ open: false, mode: null, action: null, targetId: null })
        }
        onConfirm={handleConfirmStatus}
        variant="primary"
      />

      {/* DETAIL MODAL */}
      <PengaduanDetailModal
        open={detailOpen}
        data={detailData}
        onClose={() => {
          setDetailOpen(false);
          setDetailData(null);
        }}
      />
    </div>
  );
}
