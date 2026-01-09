import React from "react";

export default function AdministrasiBulkActions({
  selectedCount,
  onClear,
  onMarkWait,
  onMarkProcess,
  onMarkDone,
}) {
  if (!selectedCount) return null;

  return (
    <div className="flex items-center justify-between gap-3 p-3 mb-3 bg-white border rounded dark:bg-gray-800 dark:border-gray-700">
      <div className="text-sm">
        <strong>{selectedCount}</strong> terpilih
      </div>

      <div className="flex items-center gap-2">
        {/* CLEAR */}
        <button
          onClick={onClear}
          className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
        >
          Bersihkan
        </button>

        {/* menunggu */}
        <button
          onClick={onMarkWait}
          className="px-3 py-1 text-sm text-white bg-yellow-600 rounded hover:bg-yellow-700"
        >
          Tandai Menunggu
        </button>

        {/* PROCESS */}
        <button
          onClick={onMarkProcess}
          className="px-3 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
        >
          Tandai Diproses
        </button>

        {/* DONE */}
        <button
          onClick={onMarkDone}
          className="px-3 py-1 text-sm text-white bg-green-600 rounded hover:bg-green-700"
        >
          Tandai Selesai
        </button>
      </div>
    </div>
  );
}
