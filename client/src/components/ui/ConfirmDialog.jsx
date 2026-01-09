import React from "react";
import { FiAlertTriangle } from "react-icons/fi";

export default function ConfirmDialog({
  open,
  title = "Konfirmasi",
  message = "Apakah Anda yakin?",
  confirmText = "Ya, Lanjutkan",
  cancelText = "Batal",
  loading = false,
  onConfirm,
  onCancel,
  variant = "primary", // primary | danger | warning
}) {
  if (!open) return null;

  const iconStyles = {
    danger: "text-red-600 bg-red-100",
    warning: "text-yellow-600 bg-yellow-100",
    primary: "text-blue-600 bg-blue-100",
  };

  const buttonStyles = {
    danger: "bg-red-600 hover:bg-red-700 text-white",
    warning: "bg-yellow-500 hover:bg-yellow-600 text-white",
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md p-6 bg-white shadow-lg rounded-xl dark:bg-gray-800">
        {/* ICON */}
        <div
          className={`flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full ${iconStyles[variant]}`}
        >
          <FiAlertTriangle size={22} />
        </div>

        {/* CONTENT */}
        <h2 className="mb-2 text-lg font-semibold text-center dark:text-white">
          {title}
        </h2>

        <p className="mb-6 text-sm text-center text-gray-600 dark:text-gray-300">
          {message}
        </p>

        {/* ACTIONS */}
        <div className="flex justify-center gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 text-sm border rounded-lg dark:border-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className={`px-4 py-2 text-sm rounded-lg transition
                        disabled:opacity-60 ${buttonStyles[variant]}`}
          >
            {loading ? "Memproses..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
