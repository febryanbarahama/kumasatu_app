import React from "react";
import { Link } from "react-router-dom";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

export default function BeritaTable({
  loading,
  items,
  baseURL,
  onDelete,
  onToggleSelect,
  selected,
  onSelectAllPage,
  allSelectedOnPage,
}) {
  const formatDate = (d) => {
    if (!d) return "-";
    const dt = new Date(d);
    return dt.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="overflow-hidden bg-white border rounded-lg shadow-md dark:bg-gray-800">
      <table className="w-full">
        <thead className="text-xs text-left uppercase bg-gray-100 dark:bg-gray-700">
          <tr>
            <th className="p-3">
              <input
                type="checkbox"
                checked={allSelectedOnPage}
                onChange={onSelectAllPage}
                aria-label="Pilih semua pada halaman"
              />
            </th>
            <th className="p-3">Gambar</th>
            <th className="p-3">Judul</th>
            <th className="p-3">Kategori</th>
            <th className="p-3">Excerpt</th>
            <th className="p-3">Tanggal</th>
            <th className="p-3 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            [...Array(6)].map((_, i) => (
              <tr key={i} className="border-t dark:border-gray-700">
                <td colSpan="7" className="p-4 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded dark:bg-gray-600"></div>
                </td>
              </tr>
            ))
          ) : items.length === 0 ? (
            <tr>
              <td colSpan="7" className="p-6 text-center text-gray-500">
                Tidak ada berita.
              </td>
            </tr>
          ) : (
            items.map((item) => (
              <tr key={item.id} className="border-t dark:border-gray-700">
                <td className="p-3">
                  <input
                    type="checkbox"
                    checked={selected.has(item.id)}
                    onChange={() => onToggleSelect(item.id)}
                  />
                </td>

                <td className="p-3">
                  <img
                    src={
                      item.image ? `${baseURL}${item.image}` : "/no-image.png"
                    }
                    alt="thumb"
                    className="object-cover w-16 h-12 border rounded"
                  />
                </td>

                <td className="p-3 font-medium">{item.title}</td>

                <td className="p-3">
                  <span className="px-2 py-1 text-sm text-white bg-blue-600 rounded">
                    {item.category || "-"}
                  </span>
                </td>

                <td className="p-3">
                  <div className="max-w-xs text-sm text-gray-600 truncate dark:text-gray-300">
                    {item.excerpt || item.content || "-"}
                  </div>
                </td>

                <td className="p-3">{formatDate(item.date)}</td>

                <td className="flex justify-center gap-2 p-3">
                  <Link
                    to={`/dashboard/informasi/berita/edit/${item.id}`}
                    className="p-2 text-blue-600 transition rounded hover:bg-blue-100 dark:hover:bg-blue-900 dark:text-blue-400"
                    title="Edit"
                  >
                    <FiEdit2 />
                  </Link>

                  <button
                    onClick={() => onDelete(item.id)}
                    className="p-2 text-red-600 transition rounded hover:bg-red-100 dark:hover:bg-red-900 dark:text-red-400"
                    title="Hapus"
                  >
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
