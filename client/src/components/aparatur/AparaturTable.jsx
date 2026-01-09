import React from "react";
import { Link } from "react-router-dom";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

const formatDate = (d) => {
  if (!d) return "-";
  const dt = new Date(d);
  return dt.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default function AparaturTable({
  loading,
  items,
  baseURL,
  onDelete,
  onToggleSelect,
  selected,
  onSelectAllPage,
  allSelectedOnPage,
}) {
  return (
    <div className="overflow-x-auto bg-white border rounded-lg shadow-md dark:bg-gray-800">
      <table className="w-full table-auto min-w-max whitespace-nowrap">
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
            <th className="p-3">Foto</th>
            <th className="p-3">Nama</th>
            <th className="p-3">Jabatan</th>
            <th className="p-3">Email</th>
            <th className="p-3">No WA</th>
            <th className="p-3">FB</th>
            <th className="p-3">IG</th>
            <th className="p-3">Status</th>
            <th className="p-3">Dibuat</th>
            <th className="p-3 text-center">Aksi</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            [...Array(6)].map((_, i) => (
              <tr key={i} className="border-t dark:border-gray-700">
                <td colSpan="11" className="p-4 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded dark:bg-gray-600"></div>
                </td>
              </tr>
            ))
          ) : items.length === 0 ? (
            <tr>
              <td colSpan="11" className="p-6 text-center text-gray-500">
                Tidak ada data aparatur.
              </td>
            </tr>
          ) : (
            items.map((item) => (
              <tr key={item.id} className="border-t dark:border-gray-700">
                {/* CHECKBOX */}
                <td className="p-3">
                  <input
                    type="checkbox"
                    checked={selected.has(item.id)}
                    onChange={() => onToggleSelect(item.id)}
                  />
                </td>

                {/* FOTO */}
                <td className="p-3">
                  <img
                    src={item.foto ? `${baseURL}${item.foto}` : "/no-image.png"}
                    alt={item.nama}
                    className="object-cover w-12 h-12 border rounded-full"
                  />
                </td>

                {/* NAMA */}
                <td className="p-3 font-medium capitalize">{item.nama}</td>

                {/* JABATAN */}
                <td className="p-3 font-medium ">{item.jabatan || "-"}</td>

                {/* EMAIL */}
                <td className="p-3 max-w-[220px] truncate">
                  {item.email || "-"}
                </td>

                {/* NO WA */}
                <td className="p-3">{item.wa || "-"}</td>

                {/* FB */}
                <td className="p-3 max-w-[200px] truncate">{item.fb || "-"}</td>

                {/* IG */}
                <td className="p-3 max-w-[200px] truncate">{item.ig || "-"}</td>

                {/* STATUS */}
                <td className="p-3">
                  <span
                    className={`px-2 py-1 text-sm rounded text-white ${
                      item.status === "active" ? "bg-green-600" : "bg-gray-500"
                    }`}
                  >
                    {item.status || "-"}
                  </span>
                </td>

                {/* CREATED */}
                <td className="p-3">{formatDate(item.created_at)}</td>

                {/* AKSI */}
                <td className="p-3">
                  <div className="flex justify-center gap-2">
                    <Link
                      to={`/dashboard/profil-kampung/aparatur/edit/${item.id}`}
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
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
