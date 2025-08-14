export function validateForm(form) {
  const errors = {};

  if (!form.no_kk) errors.no_kk = "No. KK wajib diisi";
  else if (form.no_kk.length !== 16) errors.no_kk = "No. KK harus 16 digit";

  if (!form.nama_kk) errors.nama_kk = "Nama KK wajib diisi";

  if (!form.nik_kk) errors.nik_kk = "NIK KK wajib diisi";
  else if (form.nik_kk.length !== 16) errors.nik_kk = "NIK KK harus 16 digit";

  if (!form.jenis_kelamin_kk)
    errors.jenis_kelamin_kk = "Jenis kelamin wajib diisi";

  if (!form.lindongan) errors.lindongan = "Lindongan wajib diisi";

  if (
    form.jumlah_art === "" ||
    isNaN(Number(form.jumlah_art)) ||
    Number(form.jumlah_art) < 0
  )
    errors.jumlah_art = "Jumlah ART harus angka positif";

  if (!form.status_bangunan)
    errors.status_bangunan = "Status bangunan wajib diisi";

  if (!form.status_kepemilikan_tanah)
    errors.status_kepemilikan_tanah = "Status kepemilikan tanah wajib diisi";

  if (
    form.luas_bangunan === "" ||
    isNaN(Number(form.luas_bangunan)) ||
    Number(form.luas_bangunan) < 0
  )
    errors.luas_bangunan = "Luas bangunan harus angka positif";

  if (
    form.luas_tanah === "" ||
    isNaN(Number(form.luas_tanah)) ||
    Number(form.luas_tanah) < 0
  )
    errors.luas_tanah = "Luas tanah harus angka positif";

  if (!form.jenis_lantai) errors.jenis_lantai = "Jenis lantai wajib diisi";

  if (!form.jenis_dinding) errors.jenis_dinding = "Jenis dinding wajib diisi";

  if (!form.jenis_atap) errors.jenis_atap = "Jenis atap wajib diisi";

  if (!form.fasilitas_mck) errors.fasilitas_mck = "Fasilitas MCK wajib diisi";

  if (!form.tempat_pembuangan_tinja)
    errors.tempat_pembuangan_tinja = "Tempat pembuangan tinja wajib diisi";

  if (!form.sumber_air_minum)
    errors.sumber_air_minum = "Sumber air minum wajib diisi";

  if (!form.sumber_air_mandi)
    errors.sumber_air_mandi = "Sumber air mandi wajib diisi";

  if (!form.sumber_penerangan)
    errors.sumber_penerangan = "Sumber penerangan wajib diisi";

  if (!form.daya_listrik) errors.daya_listrik = "Daya listrik wajib diisi";

  if (!form.bahan_bakar_memasak)
    errors.bahan_bakar_memasak = "Bahan bakar memasak wajib diisi";

  if (!form.tanah_lain) errors.tanah_lain = "Tanah lain wajib diisi";

  if (!form.penerima_bantuan)
    errors.penerima_bantuan = "Penerima bantuan wajib diisi";

  if (form.lokasi.x !== "" && isNaN(Number(form.lokasi.x)))
    errors.lokasi_x = "Lokasi X harus berupa angka";

  if (form.lokasi.y !== "" && isNaN(Number(form.lokasi.y)))
    errors.lokasi_y = "Lokasi Y harus berupa angka";

  return errors;
}
