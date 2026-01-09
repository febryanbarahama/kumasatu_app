import React from "react";
import { FiEye, FiCheckCircle, FiClock, FiLoader } from "react-icons/fi";

const formatDate = (d) => {
  if (!d) return "-";
  const dt = new Date(d);
  return dt.toLocaleDateString("id-ID", {
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

export default function AdministrasiTable({
  loading,
  items,
  onToggleSelect,
  selected,
  onSelectAllPage,
  allSelectedOnPage,
  onViewDetail,
  onMarkWait,
  onMarkProcessing,
  onMarkDone,
}) {
  return (
    <div className="mt-5 overflow-x-auto bg-white border rounded-lg shadow-md dark:bg-gray-800">
      <table className="w-full min-w-[1200px]">
        <thead className="text-xs text-left uppercase bg-gray-100 dark:bg-gray-700">
          <tr>
            <th className="p-3">
              <input
                type="checkbox"
                checked={allSelectedOnPage}
                onChange={onSelectAllPage}
                aria-label="Pilih semua"
              />
            </th>
            <th className="p-3">NIK</th>
            <th className="p-3">Nama</th>
            <th className="p-3">Jenis Layanan</th>
            <th className="p-3">No HP</th>
            <th className="p-3">Email</th>
            <th className="p-3">Status</th>
            <th className="p-3">Masuk</th>
            <th className="p-3 text-center">Aksi</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            [...Array(6)].map((_, i) => (
              <tr key={i} className="border-t dark:border-gray-700">
                <td colSpan="9" className="p-4 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded dark:bg-gray-600" />
                </td>
              </tr>
            ))
          ) : items.length === 0 ? (
            <tr>
              <td colSpan="9" className="p-6 text-center text-gray-500">
                Tidak ada permohonan layanan.
              </td>
            </tr>
          ) : (
            items.map((item) => (
              <tr
                key={item.id}
                className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                {/* CHECKBOX */}
                <td className="p-3">
                  <input
                    type="checkbox"
                    checked={selected.has(item.id)}
                    onChange={() => onToggleSelect(item.id)}
                  />
                </td>

                {/* NIK */}
                <td className="p-3 whitespace-nowrap">{item.nik}</td>

                {/* NAMA */}
                <td className="p-3 font-medium whitespace-nowrap">
                  {item.nama}
                </td>

                {/* JENIS LAYANAN */}
                <td className="p-3 whitespace-nowrap">{item.jenis_layanan}</td>

                {/* NO HP */}
                <td className="p-3 whitespace-nowrap">{item.no_hp}</td>

                {/* EMAIL */}
                <td className="p-3 whitespace-nowrap">{item.email || "-"}</td>

                {/* STATUS */}
                <td className="p-3">
                  <span
                    className={`px-2 py-1 text-sm text-white rounded ${statusBadge(
                      item.status
                    )}`}
                  >
                    {item.status}
                  </span>
                </td>

                {/* CREATED */}
                <td className="p-3 whitespace-nowrap">
                  {formatDate(item.created_at)}
                </td>

                {/* AKSI */}
                <td className="flex justify-center gap-2 p-3">
                  {/* DETAIL */}
                  <button
                    onClick={() => onViewDetail(item)}
                    className="p-2 text-blue-600 rounded hover:bg-blue-100 dark:hover:bg-blue-900"
                    title="Lihat detail"
                  >
                    <FiEye />
                  </button>

                  {/* menunggu */}
                  {item.status === "menunggu" && (
                    <button
                      onClick={() => onMarkProcessing(item.id)}
                      className="p-2 text-blue-600 rounded hover:bg-blue-100 dark:hover:bg-blue-900"
                      title="Tandai diproses"
                    >
                      <FiLoader />
                    </button>
                  )}

                  {/* Prosess */}
                  {item.status === "diproses" && (
                    <button
                      onClick={() => onMarkWait(item.id)}
                      className="p-2 text-yellow-600 rounded hover:bg-yellow-100 dark:hover:bg-yellow-900"
                      title="Tandai menuggu"
                    >
                      <FiClock />
                    </button>
                  )}

                  {/* SELESAI */}
                  {item.status !== "selesai" && (
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
