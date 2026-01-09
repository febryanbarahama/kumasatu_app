import React from "react";
import KeluargaListContainer from "../components/keluarga/KeluargaListContainer.jsx";

export default function KeluargaListPage() {
  return (
    <div className="w-full p-4 mx-auto max-w-7xl">
      <KeluargaListContainer />
    </div>
  );
}

/* <div className="flex items-center justify-between mb-4">
        <FilterControls
          filterLindongan={filterLindongan}
          setFilterLindongan={setFilterLindongan}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          lindonganOptions={lindonganOptions}
          onAdd={() =>
            (window.location.href = "/dashboard/penduduk/keluarga/add")
          }
          onImportChange={handleImportExcel}
          fileInputRef={fileInputRef}
        />

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2">
            <span className="text-sm">Per halaman</span>
            <select
              value={perPage}
              onChange={(e) => setPerPage(Number(e.target.value))}
              className="px-2 py-1 ml-2 border rounded dark:bg-gray-700 dark:text-gray-100"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </label>
        </div>
      </div> */

// <div className="flex items-center justify-between mt-4">
//         <div className="text-sm text-gray-600 dark:text-gray-400">
//           Menampilkan <strong>{filtered.length}</strong> hasil
//         </div>
//         <PaginationControls
//           currentPage={currentPage}
//           totalPages={totalPages}
//           onPageChange={setCurrentPage}
//         />
//       </div>

//  <th className="px-4 py-2">No KK</th>
//               <th className="px-4 py-2">Nama KK</th>
//               <th className="px-4 py-2">NIK KK</th>
//               <th className="px-4 py-2">JK KK</th>
//               <th className="px-4 py-2">Lindongan</th>
//               <th className="px-4 py-2">Jumlah ART</th>
//               <th className="px-4 py-2">Status Bangunan</th>
//               <th className="px-4 py-2">Status Kepemilikan Tanah</th>
//               <th className="px-4 py-2">Luas Bangunan</th>
//               <th className="px-4 py-2">Luas Tanah</th>
//               <th className="px-4 py-2">Jenis Lantai</th>
//               <th className="px-4 py-2">Jenis Dinding</th>
//               <th className="px-4 py-2">Jenis Atap</th>
//               <th className="px-4 py-2">Fasilitas MCK</th>
//               <th className="px-4 py-2">Tempat Pembuangan Tinja</th>
//               <th className="px-4 py-2">Sumber Air Minum</th>
//               <th className="px-4 py-2">Sumber Air Mandi</th>
//               <th className="px-4 py-2">Sumber Penerangan</th>
//               <th className="px-4 py-2">Daya Listrik</th>
//               <th className="px-4 py-2">Bahan Bakar Memasak</th>
//               <th className="px-4 py-2">Aset</th>
//               <th className="px-4 py-2">Tanah Lain</th>
//               <th className="px-4 py-2">Penerima Bantuan</th>
//               <th className="px-4 py-2">Jenis Bantuan</th>
//               <th className="px-4 py-2">Lokasi X</th>
//               <th className="px-4 py-2">Lokasi Y</th>
//               <th className="px-4 py-2">Aksi</th>
