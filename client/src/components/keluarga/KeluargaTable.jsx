import React from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

export default function KeluargaTable({
  data,
  loading,
  onEdit,
  onDelete,
  onToggleSelect,
  selected = new Set(),
}) {
  // =========================
  // SKELETON ROW
  // =========================
  if (loading) {
    return Array.from({ length: 8 }).map((_, idx) => (
      <tr key={idx} className="animate-pulse">
        {Array.from({ length: 28 }).map((__, i) => (
          <td
            key={i}
            className="px-4 py-3 border-b border-gray-300 dark:border-gray-700"
          >
            <div className="h-4 bg-gray-300 rounded dark:bg-gray-700"></div>
          </td>
        ))}
      </tr>
    ));
  }

  // =========================
  // EMPTY STATE
  // =========================
  if (!data.length)
    return (
      <tr>
        <td
          colSpan={30}
          className="py-4 text-center text-gray-500 dark:text-gray-400"
        >
          Tidak ada data keluarga
        </td>
      </tr>
    );

  // =========================
  // NORMAL DATA
  // =========================
  return data.map((item) => (
    <tr
      key={item.no_kk}
      className="transition-colors whitespace-nowrap bg-white border-t dark:border-gray-600 dark:bg-gray-800"
    >
      <td className="px-4 py-2 border-b dark:border-gray-700">
        <input
          type="checkbox"
          checked={selected.has(item.no_kk)}
          onChange={() => onToggleSelect(item.no_kk)}
        />
      </td>

      <td className="px-4 py-2 border-b dark:border-gray-700">{item.no_kk}</td>
      <td className="px-4 py-2 border-b dark:border-gray-700">
        {item.nama_kk}
      </td>
      <td className="px-4 py-2 border-b dark:border-gray-700">{item.nik_kk}</td>
      <td className="px-4 py-2 border-b dark:border-gray-700">
        {item.jenis_kelamin_kk}
      </td>
      <td className="px-4 py-2 border-b dark:border-gray-700">
        {item.lindongan}
      </td>
      <td className="px-4 py-2 border-b dark:border-gray-700">
        {item.jumlah_art}
      </td>

      <td className="px-4 py-2 border-b dark:border-gray-700">
        {item.status_bangunan}
      </td>
      <td className="px-4 py-2 border-b dark:border-gray-700">
        {item.status_kepemilikan_tanah}
      </td>
      <td className="px-4 py-2 border-b dark:border-gray-700">
        {item.luas_bangunan}
      </td>
      <td className="px-4 py-2 border-b dark:border-gray-700">
        {item.luas_tanah}
      </td>

      <td className="px-4 py-2 border-b dark:border-gray-700">
        {item.jenis_lantai}
      </td>
      <td className="px-4 py-2 border-b dark:border-gray-700">
        {item.jenis_dinding}
      </td>
      <td className="px-4 py-2 border-b dark:border-gray-700">
        {item.jenis_atap}
      </td>

      <td className="px-4 py-2 border-b dark:border-gray-700">
        {item.fasilitas_mck}
      </td>
      <td className="px-4 py-2 border-b dark:border-gray-700">
        {item.tempat_pembuangan_tinja}
      </td>
      <td className="px-4 py-2 border-b dark:border-gray-700">
        {item.sumber_air_minum}
      </td>
      <td className="px-4 py-2 border-b dark:border-gray-700">
        {item.sumber_air_mandi}
      </td>

      <td className="px-4 py-2 border-b dark:border-gray-700">
        {item.sumber_penerangan}
      </td>
      <td className="px-4 py-2 border-b dark:border-gray-700">
        {item.daya_listrik}
      </td>
      <td className="px-4 py-2 border-b dark:border-gray-700">
        {item.bahan_bakar_memasak}
      </td>

      <td className="px-4 py-2 border-b dark:border-gray-700">{item.aset}</td>
      <td className="px-4 py-2 border-b dark:border-gray-700">
        {item.tanah_lain}
      </td>
      <td className="px-4 py-2 border-b dark:border-gray-700">
        {item.penerima_bantuan}
      </td>
      <td className="px-4 py-2 border-b dark:border-gray-700">
        {item.jenis_bantuan}
      </td>

      <td className="px-4 py-2 border-b dark:border-gray-700">
        {item.lokasi?.x ?? "-"}
      </td>
      <td className="px-4 py-2 border-b dark:border-gray-700">
        {item.lokasi?.y ?? "-"}
      </td>

      <td className="flex gap-3 px-4 py-2 border-b dark:border-gray-700">
        <button
          onClick={() => onEdit(item.no_kk)}
          className="p-1 text-blue-600 hover:bg-blue-100 rounded dark:hover:bg-blue-900"
        >
          <FiEdit2 size={18} />
        </button>
        <button
          onClick={() => onDelete(item.no_kk)}
          className="p-1 text-red-600 hover:bg-red-100 rounded dark:hover:bg-red-900"
        >
          <FiTrash2 size={18} />
        </button>
      </td>
    </tr>
  ));
}
