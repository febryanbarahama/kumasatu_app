import { Link } from "react-router-dom";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

export default function GaleriTable({
  loading,
  items,
  baseURL,
  selected,
  onToggleSelect,
  onSelectAllPage,
  allSelectedOnPage,
  onDelete,
}) {
  return (
    <div className="overflow-hidden bg-white border rounded dark:bg-gray-800">
      <table className="w-full">
        <thead className="bg-gray-100 dark:bg-gray-700">
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
            <th className="p-3">Tanggal</th>
            <th className="p-3">Author</th>
            <th className="p-3 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="7" className="p-6 text-center">
                Memuat...
              </td>
            </tr>
          ) : items.length === 0 ? (
            <tr>
              <td colSpan="7" className="p-6 text-center text-gray-500">
                Tidak ada galeri
              </td>
            </tr>
          ) : (
            items.map((item) => (
              <tr key={item.id} className="border-t">
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
                    className="object-cover w-16 h-12 rounded"
                  />
                </td>
                <td className="p-3 font-medium">{item.title}</td>
                <td className="p-3">{item.category || "-"}</td>
                <td className="p-3">
                  {item.date
                    ? new Date(item.date).toLocaleDateString("id-ID")
                    : "-"}
                </td>
                <td className="p-3">{item.author}</td>
                <td className="flex justify-center gap-2 p-3">
                  <Link
                    to={`/dashboard/galeri/edit/${item.id}`}
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
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
