// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import api from "../api/config.js";
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const [summary, setSummary] = useState({
    totalPenduduk: 0,
    jumlahKepalaKeluarga: 0,
    jumlahLindongan: 0,
    laki: 0,
    perempuan: 0,
  });

  const [charts, setCharts] = useState({
    pendudukPerLindongan: [],
    usiaKomposisi: [],
    pendidikan: [],
    pekerjaan: [],
    agama: [],
    bangunan: [],
    airMandi: [],
    bantuan: [],
    perkawinan: [],
    ijazah: [],
  });

  useEffect(() => {
    document.title = "Dashboard - Admin Kampung Kuma I";
    const fetchData = async () => {
      try {
        const res = await api.get("/dashboard");
        const data = res.data;

        const laki =
          data.gender.find((g) => g.jenis_kelamin === "laki-laki")?.total || 0;
        const perempuan =
          data.gender.find((g) => g.jenis_kelamin === "perempuan")?.total || 0;

        setSummary({
          totalPenduduk: data.totalPenduduk || 0,
          jumlahKepalaKeluarga: data.totalKeluarga || 0,
          jumlahLindongan: data.perLindongan?.length || 0,
          laki,
          perempuan,
        });

        setCharts({
          pendudukPerLindongan: data.perLindongan?.map((d) => ({
            lindongan: d.lindongan,
            total: d.total,
          })),
          usiaKomposisi: data.usia?.map((d) => ({
            kategori: `${d.kelompok_usia} - ${d.jenis_kelamin}`,
            total: d.total,
          })),
          pendidikan: data.pendidikan?.map((d) => ({
            pendidikan: d.pendidikan,
            total: d.total,
          })),
          pekerjaan: data.pekerjaan?.map((d) => ({
            pekerjaan: d.pekerjaan_utama,
            total: d.total,
          })),
          agama: data.agama?.map((d) => ({
            agama: d.agama,
            total: d.total,
          })),
          bangunan: data.statusBangunan?.map((d) => ({
            status: d.status_bangunan,
            total: d.total,
          })),
          airMandi: data.sumberAirMandi?.map((d) => ({
            sumber: d.sumber_air_mandi,
            total: d.total,
          })),
          bantuan: data.bantuan?.map((d) => ({
            jenis: d.jenis_bantuan,
            total: d.total,
          })),
          perkawinan: data.statusNikah?.map((d) => ({
            status: d.status_pernikahan,
            total: d.total,
          })),
          ijazah: data.kepemilikanIjazah?.map((d) => ({
            ijazah: d.ijazah,
            total: d.total,
          })),
        });
      } catch (error) {
        console.error("Gagal memuat dashboard:", error);
      }
    };
    fetchData();
  }, []);

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#ff4d4f",
    "#8884d8",
  ];

  return (
    <div className="p-6 space-y-6">
      {/* CARD SUMMARY */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="p-4 rounded-lg shadow dark:bg-gray-800">
          <h3 className="text-gray-500">Total Penduduk</h3>
          <p className="text-2xl font-bold">{summary?.totalPenduduk ?? 0}</p>
        </div>
        <div className="p-4 rounded-lg shadow dark:bg-gray-800">
          <h3 className="text-gray-500">Kepala Keluarga</h3>
          <p className="text-2xl font-bold">
            {summary?.jumlahKepalaKeluarga ?? 0}
          </p>
        </div>
        <div className="p-4 rounded-lg shadow dark:bg-gray-800">
          <h3 className="text-gray-500">Jumlah Lindongan</h3>
          <p className="text-2xl font-bold">{summary?.jumlahLindongan ?? 0}</p>
        </div>
        <div className="p-4 rounded-lg shadow dark:bg-gray-800">
          <h3 className="text-gray-500">Laki-laki</h3>
          <p className="text-2xl font-bold">{summary?.laki ?? 0}</p>
        </div>
        <div className="p-4 rounded-lg shadow dark:bg-gray-800">
          <h3 className="text-gray-500">Perempuan</h3>
          <p className="text-2xl font-bold">{summary?.perempuan ?? 0}</p>
        </div>
      </div>

      {/* CHART - PENDUDUK PER LINDONGAN */}
      <div className="p-4 rounded-lg shadow dark:bg-gray-800">
        <h3 className="mb-4 text-lg font-semibold">Penduduk per Lindongan</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={charts.pendudukPerLindongan}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="lindongan" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* CHART - KOMPOSISI USIA */}
      <div className="p-4 rounded-lg shadow dark:bg-gray-800">
        <h3 className="mb-4 text-lg font-semibold">
          Komposisi Usia per Gender
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={charts.usiaKomposisi}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="kategori" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* PIE CHARTS GRID */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[
          {
            title: "Pendidikan Penduduk",
            data: charts.pendidikan,
            nameKey: "pendidikan",
          },
          {
            title: "Pekerjaan Utama",
            data: charts.pekerjaan,
            nameKey: "pekerjaan",
          },
          {
            title: "Agama & Kepercayaan",
            data: charts.agama,
            nameKey: "agama",
          },
          { title: "Bantuan Sosial", data: charts.bantuan, nameKey: "jenis" },
          {
            title: "Status Perkawinan",
            data: charts.perkawinan,
            nameKey: "status",
          },
          { title: "Ijazah Terakhir", data: charts.ijazah, nameKey: "ijazah" },
        ].map((chart, idx) => (
          <div
            key={idx}
            className="flex flex-col p-4 rounded-lg shadow dark:bg-gray-800"
          >
            <h3 className="mb-4 text-lg font-semibold">{chart.title}</h3>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={chart.data}
                    dataKey="total"
                    nameKey={chart.nameKey}
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                  >
                    {chart.data?.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [`${value}`, name]} />
                </PieChart>
              </ResponsiveContainer>

              {/* Ringkasan tabel kecil */}
              <div className="mt-3 space-y-1 text-sm">
                {chart.data?.map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between pb-1 border-b border-gray-700/30"
                  >
                    <span>{item[chart.nameKey]}</span>
                    <span className="font-semibold">{item.total}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
