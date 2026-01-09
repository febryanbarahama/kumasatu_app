import React from "react";

export default function AgendaBulkActions({
  selectedCount,
  onClear,
  onDelete,
}) {
  if (!selectedCount) return null;
  return (
    <div className="flex items-center justify-between gap-3 p-3 mb-3 bg-white border rounded dark:bg-gray-800 dark:border-gray-700">
      <div className="text-sm">{selectedCount} terpilih</div>
      <div className="flex items-center gap-2">
        <button
          onClick={onClear}
          className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
        >
          Bersihkan
        </button>
        <button
          onClick={onDelete}
          className="px-3 py-1 text-sm text-white bg-red-600 rounded hover:bg-red-700"
        >
          Hapus
        </button>
      </div>
    </div>
  );
}
