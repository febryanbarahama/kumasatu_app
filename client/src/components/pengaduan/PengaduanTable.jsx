import React from "react";
import { FiEye, FiCheckCircle, FiLoader } from "react-icons/fi";

const formatDate = (d) => {
  if (!d) return "-";
  return new Date(d).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const statusBadge = (status) => {
  switch (status) {
    case "menunggu":
      return "bg-yellow-600";
    case "diproses":
      return "bg-blue-600";
    case "selesai":
      return "bg-green-600";
    default:
      return "bg-gray-400";
  }
};

export default function PengaduanTable({
  loading,
  items,
  selected,
  onToggleSelect,
  onSelectAllPage,
  allSelectedOnPage,
  onViewDetail,
  onMarkProcessing,
  onMarkDone,
}) {
  return (
    <div className="mt-5 overflow-x-auto bg-white border rounded-lg shadow dark:bg-gray-800">
      <table className="w-full min-w-[1100px]">
        <thead className="text-xs uppercase bg-gray-100 dark:bg-gray-700">
          <tr>
            <th className="p-3">
              <input
                type="checkbox"
                checked={allSelectedOnPage}
                onChange={onSelectAllPage}
              />
            </th>
            <th className="p-3">NIK</th>
            <th className="p-3">Nama</th>
            <th className="p-3">Judul Pengaduan</th>
            <th className="p-3">Status</th>
            <th className="p-3">Masuk</th>
            <th className="p-3 text-center">Aksi</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            [...Array(6)].map((_, i) => (
              <tr key={i}>
                <td colSpan="7" className="p-4 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded dark:bg-gray-600" />
                </td>
              </tr>
            ))
          ) : items.length === 0 ? (
            <tr>
              <td colSpan="7" className="p-6 text-center text-gray-500">
                Tidak ada data pengaduan
              </td>
            </tr>
          ) : (
            items.map((item) => (
              <tr
                key={item.id}
                className="border-t hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700"
              >
                {/* CHECK */}
                <td className="p-3">
                  <input
                    type="checkbox"
                    checked={selected.has(item.id)}
                    onChange={() => onToggleSelect(item.id)}
                  />
                </td>

                <td className="p-3">{item.nik}</td>
                <td className="p-3 font-medium">{item.nama}</td>
                <td className="p-3 truncate max-w-[260px]">
                  {item.judul_pengaduan}
                </td>

                <td className="p-3">
                  <span
                    className={`px-2 py-1 text-sm text-white rounded ${statusBadge(
                      item.status
                    )}`}
                  >
                    {item.status}
                  </span>
                </td>

                <td className="p-3">{formatDate(item.created_at)}</td>

                <td className="flex justify-center gap-2 p-3">
                  {/* DETAIL */}
                  <button
                    onClick={() => onViewDetail(item)}
                    className="p-2 text-blue-600 rounded hover:bg-blue-100 dark:hover:bg-blue-900"
                    title="Lihat detail"
                  >
                    <FiEye />
                  </button>

                  {/* PROSES */}
                  {item.status === "menunggu" && (
                    <button
                      onClick={() => onMarkProcessing(item.id)}
                      className="p-2 text-blue-600 rounded hover:bg-blue-100 dark:hover:bg-blue-900"
                      title="Tandai diproses"
                    >
                      <FiLoader />
                    </button>
                  )}

                  {/* SELESAI */}
                  {item.status === "diproses" && (
                    <button
                      onClick={() => onMarkDone(item.id)}
                      className="p-2 text-green-600 rounded hover:bg-green-100 dark:hover:bg-green-900"
                      title="Tandai selesai"
                    >
                      <FiCheckCircle />
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
