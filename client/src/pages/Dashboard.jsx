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
  const [loading, setLoading] = useState(true);

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
    bantuan: [],
    perkawinan: [],
    ijazah: [],
  });

  useEffect(() => {
    document.title = "Dashboard - Admin Kampung Kuma I";

    const fetchData = async () => {
      try {
        const res = await api.get("/api/dashboard");
        const data = res.data;

        const laki =
          data.gender?.find((g) => g.jenis_kelamin === "laki-laki")?.total || 0;
        const perempuan =
          data.gender?.find((g) => g.jenis_kelamin === "perempuan")?.total || 0;

        setSummary({
          totalPenduduk: data.totalPenduduk || 0,
          jumlahKepalaKeluarga: data.totalKeluarga || 0,
          jumlahLindongan: data.perLindongan?.length || 0,
          laki,
          perempuan,
        });

        setCharts({
          pendudukPerLindongan:
            data.perLindongan?.map((d) => ({
              lindongan: d.lindongan,
              total: d.total,
            })) || [],
          usiaKomposisi:
            data.usia?.map((d) => ({
              kategori: `${d.kelompok_usia} - ${d.jenis_kelamin}`,
              total: d.total,
            })) || [],
          pendidikan:
            data.pendidikan?.map((d) => ({
              pendidikan: d.pendidikan,
              total: d.total,
            })) || [],
          pekerjaan:
            data.pekerjaan?.map((d) => ({
              pekerjaan: d.pekerjaan_utama,
              total: d.total,
            })) || [],
          agama:
            data.agama?.map((d) => ({
              agama: d.agama,
              total: d.total,
            })) || [],
          bantuan:
            data.bantuan?.map((d) => ({
              jenis: d.jenis_bantuan,
              total: d.total,
            })) || [],
          perkawinan:
            data.statusNikah?.map((d) => ({
              status: d.status_pernikahan,
              total: d.total,
            })) || [],
          ijazah:
            data.kepemilikanIjazah?.map((d) => ({
              ijazah: d.ijazah,
              total: d.total,
            })) || [],
        });
      } catch (error) {
        console.error("Gagal memuat dashboard:", error);
      } finally {
        setLoading(false);
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

  /* =========================
     SKELETON COMPONENT
  ========================= */

  const SkeletonCard = () => (
    <div className="p-4 rounded-lg shadow dark:bg-gray-800 animate-pulse">
      <div className="w-24 h-4 mb-2 bg-gray-300 rounded dark:bg-gray-700"></div>
      <div className="w-16 h-6 bg-gray-400 rounded dark:bg-gray-600"></div>
    </div>
  );

  const SkeletonChart = () => (
    <div className="p-4 rounded-lg shadow dark:bg-gray-800 animate-pulse">
      <div className="w-40 h-5 mb-4 bg-gray-300 rounded dark:bg-gray-700"></div>
      <div className="w-full h-[250px] bg-gray-300 rounded dark:bg-gray-700"></div>
    </div>
  );

  /* =========================
     RENDER
  ========================= */

  return (
    <div className="p-6 space-y-6">
      {/* =========================
          SUMMARY CARDS
      ========================= */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          <>
            <div className="p-4 rounded-lg shadow bg-white dark:bg-gray-800">
              <h3 className="text-gray-500">Total Penduduk</h3>
              <p className="text-2xl font-bold">{summary.totalPenduduk}</p>
            </div>

            <div className="p-4 rounded-lg shadow bg-white dark:bg-gray-800">
              <h3 className="text-gray-500">Kepala Keluarga</h3>
              <p className="text-2xl font-bold">
                {summary.jumlahKepalaKeluarga}
              </p>
            </div>

            <div className="p-4 rounded-lg shadow bg-white dark:bg-gray-800">
              <h3 className="text-gray-500">Jumlah Lindongan</h3>
              <p className="text-2xl font-bold">{summary.jumlahLindongan}</p>
            </div>

            <div className="p-4 rounded-lg shadow bg-white dark:bg-gray-800">
              <h3 className="text-gray-500">Laki-laki</h3>
              <p className="text-2xl font-bold">{summary.laki}</p>
            </div>

            <div className="p-4 rounded-lg shadow bg-white dark:bg-gray-800">
              <h3 className="text-gray-500">Perempuan</h3>
              <p className="text-2xl font-bold">{summary.perempuan}</p>
            </div>
          </>
        )}
      </div>

      {/* =========================
          BAR CHART
      ========================= */}
      {loading ? (
        <SkeletonChart />
      ) : (
        <div className="p-4 rounded-lg shado bg-white dark:bg-gray-800">
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
      )}

      {/* =========================
          PIE CHART GRID
      ========================= */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <SkeletonChart key={i} />)
          : [
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
              {
                title: "Bantuan Sosial",
                data: charts.bantuan,
                nameKey: "jenis",
              },
              {
                title: "Status Perkawinan",
                data: charts.perkawinan,
                nameKey: "status",
              },
              {
                title: "Ijazah Terakhir",
                data: charts.ijazah,
                nameKey: "ijazah",
              },
            ].map((chart, idx) => (
              <div
                key={idx}
                className="flex flex-col p-4 rounded-lg shadow bg-white dark:bg-gray-800"
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
                      >
                        {chart.data?.map((_, index) => (
                          <Cell
                            key={index}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>

                  {/* tabel kecil */}
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
