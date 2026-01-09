import React, { useEffect, useState } from "react";
import { FiSearch, FiList, FiGrid } from "react-icons/fi";
import debounce from "lodash.debounce";

export default function PengaduanToolbar({
  search,
  setSearch,
  statuses,
  statusFilter,
  setStatusFilter,
  sortBy,
  setSortBy,
  view,
  setView,
  perPage,
  setPerPage,
  enableViewToggle = false,
}) {
  const [localSearch, setLocalSearch] = useState(search);

  /* ================= SYNC SEARCH ================= */
  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const apply = debounce((q) => setSearch(q), 400);

  useEffect(() => {
    apply(localSearch);
    return () => apply.cancel && apply.cancel();
  }, [localSearch, apply]);

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      {/* LEFT */}
      <div className="flex items-center w-full gap-2 md:w-2/3">
        {/* SEARCH */}
        <div className="relative flex-1">
          <FiSearch className="absolute text-gray-400 -translate-y-1/2 left-3 top-1/2" />
          <input
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Cari NIK, nama, atau judul pengaduan..."
            className="w-full py-2 pl-10 pr-3 border rounded-md dark:bg-gray-800 dark:text-white"
          />
        </div>

        {/* STATUS */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border rounded-md dark:bg-gray-800 dark:text-white"
        >
          {statuses.map((s) => (
            <option key={s} value={s === "Semua" ? "" : s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>

        {/* SORT */}
        <select
          value={`${sortBy.field}:${sortBy.dir}`}
          onChange={(e) => {
            const [field, dir] = e.target.value.split(":");
            setSortBy({ field, dir });
          }}
          className="px-3 py-2 border rounded-md dark:bg-gray-800 dark:text-white"
        >
          <option value="created_at:desc">Terbaru</option>
          <option value="created_at:asc">Terlama</option>
          <option value="nama:asc">Nama A → Z</option>
          <option value="nama:desc">Nama Z → A</option>
          <option value="status:asc">Status A → Z</option>
        </select>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-2">
        {/* PER PAGE */}
        <select
          value={perPage}
          onChange={(e) => setPerPage(Number(e.target.value))}
          className="px-3 py-2 border rounded-md dark:bg-gray-800 dark:text-white"
        >
          <option value={5}>5 / halaman</option>
          <option value={10}>10 / halaman</option>
          <option value={20}>20 / halaman</option>
          <option value={50}>50 / halaman</option>
        </select>

        {/* VIEW TOGGLE (optional) */}
        {enableViewToggle && (
          <>
            <button
              onClick={() => setView("table")}
              className={`px-3 py-2 rounded-md border ${
                view === "table" ? "bg-blue-600 text-white" : ""
              }`}
              title="Tampilan tabel"
            >
              <FiList />
            </button>

            <button
              onClick={() => setView("grid")}
              className={`px-3 py-2 rounded-md border ${
                view === "grid" ? "bg-blue-600 text-white" : ""
              }`}
              title="Tampilan grid"
            >
              <FiGrid />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
