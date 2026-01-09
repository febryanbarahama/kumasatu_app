import React, { useState } from "react";
import { FiX, FiDownload, FiFileText, FiEye } from "react-icons/fi";

const isImage = (url) => /\.(jpg|jpeg|png|webp)$/i.test(url);
const isPDF = (url) => /\.pdf$/i.test(url);

export default function PengaduanDetailModal({ open, data, onClose, baseURL }) {
  const [preview, setPreview] = useState(null);

  if (!open || !data) return null;

  const renderPreview = () => {
    if (!preview) return null;

    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70">
        <div className="relative w-full max-w-4xl p-4 bg-white rounded-lg dark:bg-gray-900">
          <button
            onClick={() => setPreview(null)}
            className="absolute top-3 right-3"
          >
            <FiX size={22} />
          </button>

          {isImage(preview) && (
            <img
              src={preview}
              alt="Preview"
              className="max-h-[80vh] mx-auto rounded"
            />
          )}

          {isPDF(preview) && (
            <iframe
              src={preview}
              title="PDF Preview"
              className="w-full h-[80vh] rounded"
            />
          )}
        </div>
      </div>
    );
  };

  const Attachment = ({ label, path }) => {
    const url = `${baseURL}${path}`;

    return (
      <div className="flex items-center gap-2">
        {(isImage(url) || isPDF(url)) && (
          <button
            onClick={() => setPreview(url)}
            className="p-2 border rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            title="Preview"
          >
            <FiEye />
          </button>
        )}

        <a
          href={url}
          download
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-2 text-sm transition border rounded hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <FiDownload />
          {label}
        </a>
      </div>
    );
  };

  return (
    <>
      {/* MODAL */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="w-full max-w-3xl p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800">
          {/* HEADER */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Detail Pengaduan</h3>
            <button onClick={onClose}>
              <FiX size={20} />
            </button>
          </div>

          {/* CONTENT */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Info label="NIK" value={data.nik} />
            <Info label="Nama" value={data.nama} />
            <Info label="Alamat" value={data.alamat} />
            <Info label="No HP" value={data.no_hp} />
            <Info label="Email" value={data.email} />
            <Info label="Status" value={data.status} />

            <div className="md:col-span-2">
              <p className="text-sm text-gray-500">Judul Pengaduan</p>
              <p className="font-medium">{data.judul_pengaduan}</p>
            </div>

            <div className="md:col-span-2">
              <p className="text-sm text-gray-500">Isi Pengaduan</p>
              <p className="whitespace-pre-line">{data.isi_pengaduan}</p>
            </div>
          </div>

          {/* LAMPIRAN */}
          <div className="mt-5">
            <h4 className="flex items-center gap-2 mb-2 font-medium">
              <FiFileText /> Lampiran
            </h4>

            <div className="flex flex-col gap-3">
              {data.lampiran ? (
                <Attachment label="Lampiran Pengaduan" path={data.lampiran} />
              ) : (
                <p className="text-sm text-gray-500">Tidak ada lampiran</p>
              )}
            </div>
          </div>

          {/* FOOTER */}
          <div className="flex justify-end mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>

      {/* PREVIEW OVERLAY */}
      {renderPreview()}
    </>
  );
}

/* ===== Helper ===== */
const Info = ({ label, value }) => (
  <div>
    <p className="text-sm text-gray-500">{label}</p>
    <p className="font-medium">{value || "-"}</p>
  </div>
);
