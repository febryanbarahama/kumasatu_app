import React from "react";

export default function DeleteConfirmModal({
  open,
  no_kk,
  onCancel,
  onConfirm,
}) {
  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black bg-opacity-50"></div>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800">
          <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
            Konfirmasi Hapus
          </h3>
          <p className="mb-6 text-gray-700 dark:text-gray-300">
            Yakin ingin menghapus data dengan No. KK{" "}
            <span className="font-mono">{no_kk}</span>?
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-gray-800 transition bg-gray-300 rounded dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-400 dark:hover:bg-gray-600"
            >
              Batal
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 text-white transition bg-red-600 rounded hover:bg-red-700"
            >
              Hapus
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
