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

  // 🔥 HELPER WAJIB (ANTI ERROR SEMUA CASE)
  const getImageUrl = (path) => {
    if (!path || path === "null") return "/no-image.png";

    // kalau sudah full URL (Cloudinary)
    if (path.startsWith("http")) return path;

    // kalau masih path lokal
    return `${baseURL}${path}`;
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
            items.map((item) => {
              const imageSrc = getImageUrl(item.image);

              return (
                <tr key={item.id} className="border-t dark:border-gray-700">
                  {/* CHECKBOX */}
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selected.has(item.id)}
                      onChange={() => onToggleSelect(item.id)}
                    />
                  </td>

                  {/* GAMBAR */}
                  <td className="p-3">
                    <img
                      src={imageSrc || "/no-image.png"}
                      alt="thumb"
                      className="object-cover w-16 h-12 border rounded"
                      onError={(e) => {
                        if (!e.target.src.includes("no-image.png")) {
                          e.target.src = "/no-image.png";
                        }
                      }}
                    />
                  </td>

                  {/* JUDUL */}
                  <td className="p-3 font-medium">{item.title}</td>

                  {/* KATEGORI */}
                  <td className="p-3">
                    <span className="px-2 py-1 text-sm text-white bg-blue-600 rounded">
                      {item.category || "-"}
                    </span>
                  </td>

                  {/* EXCERPT */}
                  <td className="p-3">
                    <div className="max-w-xs text-sm text-gray-600 truncate dark:text-gray-300">
                      {item.excerpt || item.content || "-"}
                    </div>
                  </td>

                  {/* TANGGAL */}
                  <td className="p-3">{formatDate(item.date)}</td>

                  {/* AKSI */}
                  <td className="flex justify-center gap-2 p-3">
                    <Link
                      to={`/dashboard/informasi/berita/edit/${item.id}`}
                      className="p-2 text-blue-600 rounded hover:bg-blue-100"
                    >
                      <FiEdit2 />
                    </Link>

                    <button
                      onClick={() => onDelete(item.id)}
                      className="p-2 text-red-600 rounded hover:bg-red-100"
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
