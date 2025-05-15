import React, { useEffect, useState } from "react";
import { Head, usePage } from "@inertiajs/react";
import axios from "axios";
import mqtt from "mqtt";
import ToggleSwitch from "../../Components/ToggleSwitch";
import Topbar from "../../Components/Topbar";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend as ChartLegendPlugin,
} from "chart.js";

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, ChartLegendPlugin);

export default function Dashboard() {
  const { chart, latest } = usePage().props;
  const [latestData, setLatestData] = useState(latest);
  const [lampuStatus, setLampuStatus] = useState({ merah: false, kuning: false, hijau: false });

  

  // Ambil status awal dari Adafruit HTTP API
  useEffect(() => {
    const fetchInitialStatus = async () => {
      try {
        const headers = { "X-AIO-Key": key };
        const feeds = ["led-merah", "led-kuning", "led-hijau"];
        const requests = feeds.map(feed =>
          axios.get(`https://io.adafruit.com/api/v2/${username}/feeds/${feed}/data?limit=1`, { headers })
        );
        const responses = await Promise.all(requests);
        setLampuStatus({
          merah: responses[0].data[0].value === "1",
          kuning: responses[1].data[0].value === "1",
          hijau: responses[2].data[0].value === "1",
        });
      } catch (error) {
        console.error("Gagal mengambil status awal lampu:", error);
      }
    };
    fetchInitialStatus();
  }, []);

  useEffect(() => {
    const client = mqtt.connect("wss://io.adafruit.com", {
      username,
      password: key,
      connectTimeout: 4000,
      clean: true,
    });

    const feeds = {
      merah: `${username}/feeds/led-merah`,
      kuning: `${username}/feeds/led-kuning`,
      hijau: `${username}/feeds/led-hijau`,
    };

    client.on("connect", () => {
      console.log("MQTT Connected");
      Object.values(feeds).forEach((feed) => client.subscribe(feed));
    });

    client.on("message", (topic, message) => {
      const payload = message.toString().toLowerCase();
      const isOn = payload === "1" || payload === "true" || payload === "on";
      const lampu = Object.keys(feeds).find((key) => feeds[key] === topic);
      if (lampu) {
        console.log(`MQTT UPDATE: ${lampu} => ${isOn}`);
        setLampuStatus((prev) => ({ ...prev, [lampu]: isOn }));
      }
    });

    return () => client.end();
  }, []);

  const toggleLamp = (lampu, status) => {
    setLampuStatus((prev) => ({ ...prev, [lampu]: status }));
    axios.post(route("lampu.toggle"), { lampu, status });
  };

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

  return (
    <>
      <Head title="Dashboard" />
      <div className="min-h-screen bg-gray-100">
        <Topbar>
          <div className="flex justify-end text-sm text-gray-600 space-x-4">
            <a href={route("profile.edit")} className="hover:text-blue-600">Profil</a>
            <span className="text-gray-400">|</span>
            <a href={route("logout")} className="hover:text-blue-600">Logout</a>
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
            <div className="flex flex-row justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Controller Lampu Traffic Light</h2>
              <button onClick={() => axios.post(route("restart"))} className="text-sm text-gray-600 hover:text-blue-600">Restart</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 justify-between w-full">
              <ToggleSwitch label="Lampu Merah" isActive={lampuStatus.merah} onChange={(e) => toggleLamp("merah", e.target.checked)} color="peer-checked:bg-red-500" />
              <ToggleSwitch label="Lampu Kuning" isActive={lampuStatus.kuning} onChange={(e) => toggleLamp("kuning", e.target.checked)} color="peer-checked:bg-yellow-500" />
              <ToggleSwitch label="Lampu Hijau" isActive={lampuStatus.hijau} onChange={(e) => toggleLamp("hijau", e.target.checked)} color="peer-checked:bg-green-500" />
            </div>
          </section>
        </main>
      </div>
    </>
  );
}

const InfoCard = ({ title, value, color }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-6 shadow text-center">
    <p className="text-sm text-gray-500 mb-2">{title}</p>
    <p className={`text-3xl font-bold ${color}`}>{value}</p>
  </div>
);

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