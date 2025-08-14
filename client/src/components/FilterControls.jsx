import React from "react";
import { FiPlus, FiUpload } from "react-icons/fi";

export default function FilterControls({
  filterLindongan,
  setFilterLindongan,
  searchTerm,
  setSearchTerm,
  lindonganOptions,
  onAdd,
  onImportChange,
  fileInputRef,
}) {
  return (
    <div className="flex flex-col items-center gap-3 sm:flex-row">
      <select
        value={filterLindongan}
        onChange={(e) => setFilterLindongan(e.target.value)}
        className="px-3 py-2 border rounded dark:bg-gray-700 dark:text-gray-100"
      >
        <option value="">Semua Lindongan</option>
        {lindonganOptions.map((lind) => (
          <option key={lind} value={lind}>
            {lind}
          </option>
        ))}
      </select>

      <input
        type="text"
        placeholder="Cari No KK, Nama KK, atau NIK KK..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="px-3 py-2 border rounded dark:bg-gray-700 dark:text-gray-100"
      />

      <button
        onClick={onAdd}
        className="flex items-center gap-2 px-4 py-2 text-blue-600 transition rounded-lg dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900 hover:shadow-sm"
      >
        <FiPlus size={18} /> Tambah Data
      </button>

      <label
        htmlFor="importExcel"
        className="flex items-center gap-2 px-4 py-2 text-green-600 transition rounded-lg cursor-pointer dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900 hover:shadow-sm"
        title="Import data dari file Excel"
      >
        <FiUpload size={18} /> Import
      </label>
      <input
        type="file"
        id="importExcel"
        accept=".xls,.xlsx"
        onChange={onImportChange}
        className="hidden"
        ref={fileInputRef}
      />
    </div>
  );
}
