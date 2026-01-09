import React from "react";

export default function Toast({ show, message, type }) {
  if (!show) return null;

  return (
    <div
      className={`fixed top-5 right-5 z-50 px-6 py-3 rounded-md shadow-lg text-white font-semibold select-none transition-transform transform ${
        type === "success"
          ? "bg-green-600"
          : type === "error"
          ? "bg-red-600"
          : "bg-gray-600"
      } animate-slide-in`}
      style={{ animationDuration: "0.3s" }}
    >
      {message}
    </div>
  );
}
