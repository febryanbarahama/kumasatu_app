import React from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";

function LocationSelector({ lokasi, setLokasi }) {
  useMapEvents({
    click(e) {
      setLokasi({ x: e.latlng.lat, y: e.latlng.lng });
    },
  });

  return lokasi.x && lokasi.y ? (
    <Marker position={[lokasi.x, lokasi.y]} />
  ) : null;
}

export default function LocationPicker({ lokasi, setLokasi, onChange }) {
  return (
    <div className="md:col-span-2">
      <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-200">
        Lokasi (Klik pada peta untuk memilih)
      </label>
      <div className="flex flex-col gap-3 md:flex-row">
        <input
          type="number"
          step="any"
          name="x"
          placeholder="Latitude (X)"
          value={lokasi.x}
          onChange={onChange}
          className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-md dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:border-gray-600"
        />
        <input
          type="number"
          step="any"
          name="y"
          placeholder="Longitude (Y)"
          value={lokasi.y}
          onChange={onChange}
          className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-md dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:border-gray-600"
        />
      </div>
      <div className="h-64 mt-4 overflow-hidden border border-gray-300 rounded-md dark:border-gray-600">
        <MapContainer
          center={
            lokasi.x && lokasi.y ? [lokasi.x, lokasi.y] : [-2.2011, 125.3495]
          }
          zoom={13}
          scrollWheelZoom={true}
          className="w-full h-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationSelector lokasi={lokasi} setLokasi={setLokasi} />
        </MapContainer>
      </div>
    </div>
  );
}
