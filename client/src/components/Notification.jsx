import React from "react";

export default function Notification({ message, type, onClose }) {
  if (!message) return null;

  const baseClasses =
    "fixed z-50 max-w-xs px-4 py-3 rounded-lg shadow-lg top-5 right-5 font-semibold animate-fadeInOut cursor-pointer select-none";
  const typeClasses =
    type === "success"
      ? "bg-green-600 border border-green-800 text-white"
      : "bg-red-600 border border-red-800 text-white";

  return (
    <div
      className={`${baseClasses} ${typeClasses}`}
      role="alert"
      onClick={onClose}
      title="Klik untuk menutup"
    >
      {message}
    </div>
  );
}
