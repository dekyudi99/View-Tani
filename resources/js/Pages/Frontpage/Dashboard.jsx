import React, { useEffect, useState } from "react";
import { Head, usePage, useForm } from "@inertiajs/react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import Topbar from "../../Components/Topbar";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend as ChartLegendPlugin,
} from "chart.js";

// Registrasi plugin chart.js
ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, ChartLegendPlugin);

export default function Dashboard() {
  const { chart, latest } = usePage().props;
  const { post } = useForm();
  const [latestData, setLatestData] = useState(latest);

  // Polling real-time data dari Adafruit setiap 5 detik
  useEffect(() => {
    const interval = setInterval(() => {
      axios.get(route("get.latest"))
        .then(res => setLatestData(res.data))
        .catch(console.error);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const chartData = {
    labels: chart.labels,
    datasets: [
      {
        label: "Suhu (°C)",
        data: chart.suhu,
        borderColor: "#ef4444",
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        tension: 0.4,
      },
      {
        label: "Kelembapan (%)",
        data: chart.kelembapan,
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
    },
    scales: {
      y: { min: 20, max: 100, ticks: { stepSize: 5 } },
      x: { ticks: { autoSkip: true, maxTicksLimit: 7 } },
    },
  };

  const handleAction = (routeName) => {
    post(route(routeName), {
      preserveScroll: true,
      preserveState: true,
    });
  };

  // ✅ Semua konten disimpan dalam variabel `content`
  const content = (
    <>
      <Head title="Dashboard" />
      <div className="min-h-screen bg-white">
        <Topbar>
          <div className="flex flex-row space-x-4 text-sm text-gray-600">
            <button onClick={() => handleAction("restart")} className="hover:text-blue-600">Restart</button>
            <span className="text-gray-400">|</span>
            <button onClick={() => handleAction("logout")} className="hover:text-blue-600">Logout</button>
          </div>
        </Topbar>

        <main className="max-w-6xl mx-auto px-6 py-10 space-y-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <InfoCard title="Suhu" value={`${latestData.suhu}°C`} color="text-red-500" />
            <InfoCard title="Kelembapan" value={`${latestData.kelembapan}%`} color="text-blue-500" />
          </div>

          <section className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Suhu & Kelembapan</h2>
            <Line data={chartData} options={chartOptions} />
            <ChartLegend />
          </section>

          <section className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Indikator Lampu</h2>
            <div className="flex flex-wrap items-center gap-4">
              <StatusIndicator color="green" label="Normal" />
              <StatusIndicator color="yellow" label="Waspada" />
              <StatusIndicator color="red" label="Bahaya" />
              <div className="w-full border-t my-4" />
              <LampButton label="Nyalakan Lampu Hijau" color="green" onClick={() => handleAction("hijau")} />
              <LampButton label="Nyalakan Lampu Kuning" color="yellow" onClick={() => handleAction("kuning")} />
              <LampButton label="Nyalakan Lampu Merah" color="red" onClick={() => handleAction("merah")} />
            </div>
          </section>
        </main>
      </div>
    </>
  );

  return content;
}

const InfoCard = ({ title, value, color }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-6 shadow text-center">
    <p className="text-sm text-gray-500 mb-2">{title}</p>
    <p className={`text-3xl font-bold ${color}`}>{value}</p>
  </div>
);

const StatusIndicator = ({ color, label }) => {
  const bgColor = {
    green: "bg-green-500",
    yellow: "bg-yellow-400",
    red: "bg-red-500",
  }[color];

  return (
    <div className="flex items-center gap-2 text-sm text-gray-700">
      <div className={`w-5 h-5 rounded-full ${bgColor}`} />
      <span>{label}</span>
    </div>
  );
};

const LampButton = ({ label, color, onClick }) => {
  const bgColor = {
    green: "bg-green-500 hover:bg-green-600",
    yellow: "bg-yellow-400 hover:bg-yellow-500",
    red: "bg-red-500 hover:bg-red-600",
  }[color];

  return (
    <button onClick={onClick} className={`px-4 py-2 text-white rounded ${bgColor}`}>
      {label}
    </button>
  );
};

const ChartLegend = () => (
  <div className="mt-4 flex items-center gap-6 text-sm text-gray-600">
    <div className="flex items-center gap-2">
      <span className="w-4 h-4 rounded-full bg-red-500" />
      <span>Suhu</span>
    </div>
    <div className="flex items-center gap-2">
      <span className="w-4 h-4 rounded-full bg-blue-500" />
      <span>Kelembapan</span>
    </div>
  </div>
);