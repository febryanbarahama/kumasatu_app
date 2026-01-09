import React from "react";
import { Link } from "react-router-dom";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

export default function AgendaGrid({
  loading,
  items,
  baseURL,
  onDelete,
  onToggleSelect,
  selected,
}) {
  const formatDate = (d) => {
    if (!d) return "-";
    return new Date(d).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="p-4 bg-white rounded-lg shadow animate-pulse dark:bg-gray-800"
          />
        ))}
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="p-8 text-center text-gray-500">Tidak ada agenda.</div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <article
          key={item.id}
          className="flex flex-col overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800"
        >
          {/* IMAGE + CHECKBOX */}
          <div className="relative">
            <img
              src={item.image ? `${baseURL}${item.image}` : "/no-image.png"}
              alt={item.title}
              className="object-cover w-full h-44"
            />
            <label className="absolute top-2 left-2">
              <input
                type="checkbox"
                checked={selected.has(item.id)}
                onChange={() => onToggleSelect(item.id)}
                className="w-4 h-4"
              />
            </label>
          </div>

          {/* CONTENT */}
          <div className="flex flex-col flex-1 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="px-2 py-1 text-sm text-white bg-blue-600 rounded">
                {item.category || "-"}
              </span>
              <span className="text-xs text-gray-500">
                {formatDate(item.date)}
              </span>
            </div>

            <h3 className="mb-2 text-lg font-semibold">{item.title}</h3>

            <p className="flex-1 mb-4 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
              {item.location || "-"}
            </p>

            {/* ACTIONS */}
            <div className="flex items-center justify-between">
              <Link
                to={`/dashboard/informasi/agenda/edit/${item.id}`}
                className="text-blue-600"
                title="Edit"
              >
                <FiEdit2 />
              </Link>
              <button
                onClick={() => onDelete(item.id)}
                className="text-red-600"
                title="Hapus"
              >
                <FiTrash2 />
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
