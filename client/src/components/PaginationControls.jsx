import React from "react";

export default function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
}) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-4">
      <button
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded hover:bg-gray-400 disabled:opacity-50 dark:hover:bg-gray-600"
      >
        Prev
      </button>
      <span className="font-semibold text-gray-700 dark:text-gray-300">
        {currentPage} / {totalPages}
      </span>
      <button
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded hover:bg-gray-400 disabled:opacity-50 dark:hover:bg-gray-600"
      >
        Next
      </button>
    </div>
  );
}
