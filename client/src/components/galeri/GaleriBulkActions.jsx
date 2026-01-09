export default function GaleriBulkActions({
  selectedCount,
  onClear,
  onDelete,
}) {
  if (!selectedCount) return null;

  return (
    <div className="flex items-center justify-between p-3 mb-3 bg-white border rounded dark:bg-gray-800">
      <span className="text-sm">{selectedCount} terpilih</span>
      <div className="flex gap-2">
        <button
          onClick={onClear}
          className="px-3 py-1 text-sm bg-gray-200 rounded dark:bg-gray-700"
        >
          Bersihkan
        </button>
        <button
          onClick={onDelete}
          className="px-3 py-1 text-sm text-white bg-red-600 rounded"
        >
          Hapus
        </button>
      </div>
    </div>
  );
}
