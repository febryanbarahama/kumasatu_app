import React from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

export default function IndividuTable({
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
          colSpan={40}
          className="py-4 text-center text-gray-500 dark:text-gray-400"
        >
          Tidak ada data individu
        </td>
      </tr>
    );

  return data.map((item) => (
    <tr key={item.nik} className="transition-colors bg-white dark:bg-gray-800">
      <td className="px-4 py-2 border-b border-gray-300 dark:border-gray-700 whitespace-nowrap">
        <input
          type="checkbox"
          checked={selected.has(item.nik)}
          onChange={() => onToggleSelect(item.nik)}
        />
      </td>
      <td className="px-4 py-2 border-b border-gray-300 dark:border-gray-700 whitespace-nowrap">
        {item.nik}
      </td>
      <td className="px-4 py-2 border-b border-gray-300 dark:border-gray-700 whitespace-nowrap">
        {item.no_kk}
      </td>
      <td className="px-4 py-2 border-b border-gray-300 dark:border-gray-700 whitespace-nowrap">
        {item.nama}
      </td>
      <td className="px-4 py-2 border-b border-gray-300 dark:border-gray-700 whitespace-nowrap">
        {item.lindongan}
      </td>
      <td className="px-4 py-2 border-b border-gray-300 dark:border-gray-700 whitespace-nowrap">
        {item.jenis_kelamin}
      </td>
      <td className="px-4 py-2 border-b border-gray-300 dark:border-gray-700 whitespace-nowrap">
        {item.usia}
      </td>
      <td className="px-4 py-2 border-b border-gray-300 dark:border-gray-700 whitespace-nowrap">
        {item.tanggal_lahir}
      </td>
      <td className="px-4 py-2 border-b border-gray-300 dark:border-gray-700 whitespace-nowrap">
        {item.status_pernikahan}
      </td>
      <td className="px-4 py-2 border-b border-gray-300 dark:border-gray-700 whitespace-nowrap">
        {item.agama}
      </td>
      <td className="px-4 py-2 border-b border-gray-300 dark:border-gray-700 whitespace-nowrap">
        {item.warga_negara}
      </td>
      <td className="px-4 py-2 border-b border-gray-300 dark:border-gray-700 whitespace-nowrap">
        {item.akta_kelahiran}
      </td>
      <td className="px-4 py-2 border-b border-gray-300 dark:border-gray-700 whitespace-nowrap">
        {item.ijazah_terakhir}
      </td>
      <td className="px-4 py-2 border-b border-gray-300 dark:border-gray-700 whitespace-nowrap">
        {item.kegiatan_utama}
      </td>
      <td className="px-4 py-2 border-b border-gray-300 dark:border-gray-700 whitespace-nowrap">
        {item.pip}
      </td>
      <td className="px-4 py-2 border-b border-gray-300 dark:border-gray-700 whitespace-nowrap">
        {item.deskripsi_pekerjaan}
      </td>
      <td className="px-4 py-2 border-b border-gray-300 dark:border-gray-700 whitespace-nowrap">
        {item.pekerjaan_utama}
      </td>
      <td className="px-4 py-2 border-b border-gray-300 dark:border-gray-700 whitespace-nowrap">
        {item.status_pekerjaan}
      </td>
      <td className="px-4 py-2 border-b border-gray-300 dark:border-gray-700 whitespace-nowrap">
        {item.pendapatan}
      </td>
      <td className="px-4 py-2 border-b border-gray-300 dark:border-gray-700 whitespace-nowrap">
        {item.jaminan_kesehatan}
      </td>
      <td className="px-4 py-2 border-b border-gray-300 dark:border-gray-700 whitespace-nowrap">
        {item.disabilitas}
      </td>
      <td className="px-4 py-2 border-b border-gray-300 dark:border-gray-700 whitespace-nowrap">
        {item.penyakit}
      </td>
      <td className="px-4 py-2 border-b border-gray-300 dark:border-gray-700 whitespace-nowrap">
        {item.rawat_jalan}
      </td>
      <td className="px-4 py-2 border-b border-gray-300 dark:border-gray-700 whitespace-nowrap">
        {item.kali_rawat_jalan}
      </td>
      <td className="px-4 py-2 border-b border-gray-300 dark:border-gray-700 whitespace-nowrap">
        {item.tempat_rawat_jalan}
      </td>
      <td className="px-4 py-2 border-b border-gray-300 dark:border-gray-700 whitespace-nowrap">
        {item.rawat_inap}
      </td>
      <td className="px-4 py-2 border-b border-gray-300 dark:border-gray-700 whitespace-nowrap">
        {item.kali_rawat_inap}
      </td>
      <td className="px-4 py-2 border-b border-gray-300 dark:border-gray-700 whitespace-nowrap">
        {item.tempat_rawat_inap}
      </td>
      <td className="px-4 py-2 border-b border-gray-300 dark:border-gray-700 whitespace-nowrap">
        {item.catatan}
      </td>
      <td className="flex gap-3 px-4 py-2 border-b border-gray-300 dark:border-gray-700 whitespace-nowrap">
        <button
          onClick={() => onEdit(item.nik)}
          className="p-1 text-blue-600 transition rounded hover:bg-blue-100 dark:hover:bg-blue-900 dark:text-blue-400"
          title="Edit"
        >
          <FiEdit2 size={18} />
        </button>
        <button
          onClick={() => onDelete(item.nik)}
          className="p-1 text-red-600 transition rounded hover:bg-red-100 dark:hover:bg-red-900 dark:text-red-400"
          title="Hapus"
        >
          <FiTrash2 size={18} />
        </button>
      </td>
    </tr>
  ));
}
