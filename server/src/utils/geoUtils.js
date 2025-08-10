// utils/geoUtils.js

/**
 * Convert input lokasi ke WKT POINT string yang valid.
 * Input bisa:
 * - string "10 20"
 * - string "10,20"
 * - object {x: 10, y: 20}
 * - object {lat: 10, lng: 20} (opsional)
 *
 * Jika invalid, kembalikan null.
 */
export function convertToWKTPoint(lokasi) {
  if (!lokasi) return null;

  if (typeof lokasi === "string") {
    // Ganti koma dengan spasi, hapus spasi berlebih
    const fixed = lokasi.replace(",", " ").trim();
    const parts = fixed.split(/\s+/);

    if (parts.length !== 2) return null;

    const x = Number(parts[0]);
    const y = Number(parts[1]);

    if (isNaN(x) || isNaN(y)) return null;

    return `POINT(${x} ${y})`;
  }

  if (typeof lokasi === "object") {
    // Cek properti x,y atau lat,lng
    let x = null;
    let y = null;

    if ("x" in lokasi && "y" in lokasi) {
      x = Number(lokasi.x);
      y = Number(lokasi.y);
    } else if ("lat" in lokasi && "lng" in lokasi) {
      x = Number(lokasi.lng); // lng = x
      y = Number(lokasi.lat); // lat = y
    }

    if (x === null || y === null) return null;
    if (isNaN(x) || isNaN(y)) return null;

    return `POINT(${x} ${y})`;
  }

  return null;
}
