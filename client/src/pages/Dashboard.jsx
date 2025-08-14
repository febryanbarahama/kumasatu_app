// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import api from "../api/config.js";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalKeluarga: 0,
    totalIndividu: 0,
    laki: 0,
    perempuan: 0,
  });
  const [chartData, setChartData] = useState([]);
  const [bantuanData, setBantuanData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/dashboard");

        // Pastikan data selalu punya struktur default
        setStats(
          res.data?.stats || {
            totalKeluarga: 0,
            totalIndividu: 0,
            laki: 0,
            perempuan: 0,
          }
        );
        setChartData(res.data?.chartPenduduk || []);
        setBantuanData(res.data?.bantuanChart || []);
      } catch (error) {
        console.error("Gagal memuat dashboard:", error);
      }
    };
    fetchData();
  }, []);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#ff4d4f"];

  return (
    <div className="p-6 space-y-6">
      {/* CARD STATISTIK */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="p-4 rounded-lg shadow dark:bg-gray-800">
          <h3 className="text-gray-500">Total Keluarga</h3>
          <p className="text-2xl font-bold">{stats?.totalKeluarga ?? 0}</p>
        </div>
        <div className="p-4 rounded-lg shadow dark:bg-gray-800">
          <h3 className="text-gray-500">Total Individu</h3>
          <p className="text-2xl font-bold">{stats?.totalIndividu ?? 0}</p>
        </div>
        <div className="p-4 rounded-lg shadow dark:bg-gray-800">
          <h3 className="text-gray-500">Laki-laki</h3>
          <p className="text-2xl font-bold">{stats?.laki ?? 0}</p>
        </div>
        <div className="p-4 rounded-lg shadow dark:bg-gray-800">
          <h3 className="text-gray-500">Perempuan</h3>
          <p className="text-2xl font-bold">{stats?.perempuan ?? 0}</p>
        </div>
      </div>

      {/* CHART PERTUMBUHAN PENDUDUK */}
      <div className="p-4 rounded-lg shadow dark:bg-gray-800">
        <h3 className="mb-4 text-lg font-semibold">
          Pertumbuhan Penduduk per Tahun
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="tahun" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="jumlah" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* CHART PIE DATA BANTUAN */}
      <div className="p-4 rounded-lg shadow dark:bg-gray-800">
        <h3 className="mb-4 text-lg font-semibold">
          Distribusi Penerima Bantuan
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={bantuanData}
              dataKey="jumlah"
              nameKey="jenis"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label
            >
              {bantuanData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
