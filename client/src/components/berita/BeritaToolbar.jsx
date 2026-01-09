import React, { useState, useEffect } from "react";
import {
  FiSearch,
  FiPlus,
  FiList,
  FiGrid,
  FiChevronDown,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import debounce from "lodash.debounce";

export default function BeritaToolbar({
  search,
  setSearch,
  categories,
  categoryFilter,
  setCategoryFilter,
  sortBy,
  setSortBy,
  view,
  setView,
  perPage,
  setPerPage,
}) {
  const [localSearch, setLocalSearch] = useState(search);

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
      <div className="flex items-center w-full gap-2 md:w-2/3">
        <div className="relative flex-1">
          <FiSearch className="absolute text-gray-400 -translate-y-1/2 left-3 top-1/2" />
          <input
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Cari judul, excerpt, kategori..."
            className="w-full py-2 pl-10 pr-3 border rounded-md dark:bg-gray-800 dark:text-white"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2 border rounded-md dark:bg-gray-800 dark:text-white"
          aria-label="Filter kategori"
        >
          {categories.map((c) => (
            <option key={c} value={c === "Semua" ? "" : c}>
              {c}
            </option>
          ))}
        </select>

        <select
          value={`${sortBy.field}:${sortBy.dir}`}
          onChange={(e) => {
            const [field, dir] = e.target.value.split(":");
            setSortBy({ field, dir });
          }}
          className="px-3 py-2 border rounded-md dark:bg-gray-800 dark:text-white"
          aria-label="Sort"
        >
          <option value="date:desc">Tanggal terbaru</option>
          <option value="date:asc">Tanggal terlama</option>
          <option value="title:asc">Judul A → Z</option>
          <option value="title:desc">Judul Z → A</option>
          <option value="category:asc">Kategori A → Z</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <select
          value={perPage}
          onChange={(e) => setPerPage(Number(e.target.value))}
          className="px-3 py-2 border rounded-md dark:bg-gray-800 dark:text-white"
          aria-label="Per halaman"
        >
          <option value={5}>5 / halaman</option>
          <option value={10}>10 / halaman</option>
          <option value={20}>20 / halaman</option>
          <option value={50}>50 / halaman</option>
        </select>

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

        <Link
          to="/dashboard/informasi/berita/add"
          className="flex items-center gap-2 px-4 py-2 text-blue-600 transition rounded-lg dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900 hover:shadow-sm"
        >
          <FiPlus size={18} />
          Tambah
        </Link>
      </div>
    </div>
  );
}
