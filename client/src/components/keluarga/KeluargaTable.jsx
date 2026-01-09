import React from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

export default function KeluargaTable({
  data,
  onEdit,
  onDelete,
  onToggleSelect,
  selected = new Set(),
}) {
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

  return data.map((item) => (
    <tr
      key={item.no_kk}
      className="transition-colors bg-white border-t dark:border-gray-600 dark:bg-gray-800"
    >
      <td className="px-4 py-2 border-b border-gray-300 dark:border-gray-700 whitespace-nowrap">
        <input
          type="checkbox"
          checked={selected.has(item.no_kk)}
          onChange={() => onToggleSelect(item.no_kk)}
        />
      </td>
      <td className="px-4 py-2 border-b border-gray-300 dark:border-gray-700 whitespace-nowrap">
        {item.no_kk}
      </td>
      <td className="px-4 py-2 border-b border-gray-300 dark:border-gray-700 whitespace-nowrap">
        {item.nama_kk}
      </td>
      <td className="px-4 py-2 border-b border-gray-300 dark:border-gray-700 whitespace-nowrap">
        {item.nik_kk}
      </td>
      <td className="px-4 py-2 border-b border-gray-300 dark:border-gray-700 whitespace-nowrap">
        {item.jenis_kelamin_kk}
      </td>
      <td className="px-4 py-2 border-b border-gray-300 dark:border-gray-700 whitespace-nowrap">
        {item.lindongan}
      </td>
      <td className="px-4 py-2 border-b border-gray-300 dark:border-gray-700 whitespace-nowrap">
        {item.jumlah_art}
      </td>
      <td className="px-4 py-2 border-b border-gray-300 dark:border-gray-700 whitespace-nowrap">
        {item.status_bangunan}
      </td>
      <td className="px-4 py-2 border-b border-gray-300 dark:border-gray-700 whitespace-nowrap">
        {item.status_kepemilikan_tanah}
      </td>
      <td className="px-4 py-2 border-b border-gray-300 dark:border-gray-700 whitespace-nowrap">
        {item.luas_bangunan}
      </td>
      <td className="px-4 py-2 border-b border-gray-300 dark:border-gray-700 whitespace-nowrap">
        {item.luas_tanah}
      </td>
      <td className="px-4 py-2 border-b border-gray-300 dark:border-gray-700 whitespace-nowrap">
        {item.jenis_lantai}
      </td>
      <td className="px-4 py-2 border-b border-gray-300 dark:border-gray-700 whitespace-nowrap">
        {item.jenis_dinding}
      </td>
      <td className="px-4 py-2 border-b border-gray-300 dark:border-gray-700 whitespace-nowrap">
        {item.jenis_atap}
      </td>
      <td className="px-4 py-2 border-b border-gray-300 dark:border-gray-700 whitespace-nowrap">
        {item.fasilitas_mck}
      </td>
      <td className="px-4 py-2 border-b border-gray-300 dark:border-gray-700 whitespace-nowrap">
        {item.tempat_pembuangan_tinja}
      </td>
      <td className="px-4 py-2 border-b border-gray-300 dark:border-gray-700 whitespace-nowrap">
        {item.sumber_air_minum}
      </td>
      <td className="px-4 py-2 border-b border-gray-300 dark:border-gray-700 whitespace-nowrap">
        {item.sumber_air_mandi}
      </td>
      <td className="px-4 py-2 border-b border-gray-300 dark:border-gray-700 whitespace-nowrap">
        {item.sumber_penerangan}
      </td>
      <td className="px-4 py-2 border-b border-gray-300 dark:border-gray-700 whitespace-nowrap">
        {item.daya_listrik}
      </td>
      <td className="px-4 py-2 border-b border-gray-300 dark:border-gray-700 whitespace-nowrap">
        {item.bahan_bakar_memasak}
      </td>
      <td className="px-4 py-2 border-b border-gray-300 dark:border-gray-700 whitespace-nowrap">
        {item.aset}
      </td>
      <td className="px-4 py-2 border-b border-gray-300 dark:border-gray-700 whitespace-nowrap">
        {item.tanah_lain}
      </td>
      <td className="px-4 py-2 border-b border-gray-300 dark:border-gray-700 whitespace-nowrap">
        {item.penerima_bantuan}
      </td>
      <td className="px-4 py-2 border-b border-gray-300 dark:border-gray-700 whitespace-nowrap">
        {item.jenis_bantuan}
      </td>
      <td className="px-4 py-2 border-b border-gray-300 dark:border-gray-700 whitespace-nowrap">
        {item.lokasi?.x ?? "-"}
      </td>
      <td className="px-4 py-2 border-b border-gray-300 dark:border-gray-700 whitespace-nowrap">
        {item.lokasi?.y ?? "-"}
      </td>
      <td className="flex gap-3 px-4 py-2 border-b border-gray-300 dark:border-gray-700 whitespace-nowrap">
        <button
          onClick={() => onEdit(item.no_kk)}
          className="p-1 text-blue-600 transition rounded hover:bg-blue-100 dark:hover:bg-blue-900 dark:text-blue-400"
          title="Edit"
        >
          <FiEdit2 size={18} />
        </button>
        <button
          onClick={() => onDelete(item.no_kk)}
          className="p-1 text-red-600 transition rounded hover:bg-red-100 dark:hover:bg-red-900 dark:text-red-400"
          title="Hapus"
        >
          <FiTrash2 size={18} />
        </button>
      </td>
    </tr>
  ));
}
