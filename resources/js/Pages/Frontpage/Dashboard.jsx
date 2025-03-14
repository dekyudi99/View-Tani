import React from "react";
import Layout from "../../Layouts/Layout";
import TopContainer from "@/Components/TopContainer";
import BottomContainer from "@/Components/BottomContainer";
import { Gauge, BarChart } from "lucide-react";
import { Head } from "@inertiajs/react";
import { motion } from "framer-motion";
import { Line } from "react-chartjs-2"; // Pakai Chart.js untuk grafik
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

// Registrasi komponen Chart.js
ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

const Dashboard = () => {
  // Data Parameter
  const parameters = [
    { id: 1, name: "Suhu", value: "28°C" },
    { id: 2, name: "Kelembaban", value: "65%" },
    { id: 3, name: "pH Tanah", value: "6.5" },
  ];

  // Data Grafik (Dummy)
  const chartData = {
    labels: ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"],
    datasets: [
      {
        label: "Suhu Harian (°C)",
        data: [27, 28, 29, 30, 28, 27, 26],
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.3,
      },
    ],
  };

  return (
    <div className="min-h-screen overflow-hidden bg-gray-100">
      <Head title="Dashboard" />
      <Layout header="Dashboard">

        {/* Top Container - Parameter Aktif */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <TopContainer icon={Gauge} title="Parameter Aktif">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {parameters.map((param) => (
                <motion.div
                  key={param.id}
                  className="flex flex-col items-center justify-center p-4 bg-white border border-gray-300 rounded-lg shadow-md"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: param.id * 0.1 }}
                >
                  <Gauge size={40} className="text-blue-500" />
                  <p className="mt-2 text-lg font-semibold">{param.name}</p>
                  <p className="text-sm text-gray-600">{param.value}</p>
                </motion.div>
              ))}
            </div>
          </TopContainer>
        </motion.div>

        {/* Bottom Container - Grafik */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <BottomContainer icon={BarChart} title="Grafik">
            <div className="p-4 bg-white rounded-lg shadow-md">
              <Line data={chartData} />
            </div>
          </BottomContainer>
        </motion.div>

      </Layout>
    </div>
  );
};

export default Dashboard;
