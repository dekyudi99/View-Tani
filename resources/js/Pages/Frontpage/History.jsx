import React from "react";
import Layout from "../../Layouts/Layout";
import { Head } from "@inertiajs/react";
import { AlertCircle, Waves, Thermometer, FileText } from "lucide-react";

const History = () => {
  // Data Resume
  const resumeData = [
    { icon: <AlertCircle size={50} className="text-red-500" />, label: "108 Serangga Terdeteksi" },
    { icon: <Waves size={50} className="text-blue-500" />, label: "Kelembaban Menurun 3 Kali" },
    { icon: <Thermometer size={50} className="text-orange-500" />, label: "Suhu Meningkat 3 Kali" },
  ];

  // Data Tabel
  const tableData = [
    { perangkat: "Perangkat 1", sensor: "56 Serangga Terdeteksi Masuk", waktu: "06/03/2025 10.23" },
    { perangkat: "Perangkat 1", sensor: "56 Serangga Terdeteksi Masuk", waktu: "05/03/2025 07.54" },
    { perangkat: "Perangkat 2", sensor: "Suhu Ruangan Meningkat 28°C", waktu: "02/03/2025 12.54" },
    { perangkat: "Perangkat 3", sensor: "Kelembaban Menurun 25%", waktu: "02/03/2025 12.53" },
    { perangkat: "Perangkat 3", sensor: "Kelembaban Menurun 25%", waktu: "02/03/2025 12.40" },
    { perangkat: "Perangkat 2", sensor: "Suhu Ruangan Meningkat 28°C", waktu: "01/03/2025 13.15" },
    { perangkat: "Perangkat 2", sensor: "Suhu Ruangan Meningkat 28°C", waktu: "01/03/2025 12.55" },
    { perangkat: "Perangkat 3", sensor: "Kelembaban Menurun 25%", waktu: "01/03/2025 12.53" },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <Head title="History" />
      <Layout header="History">

        {/* Resume Section */}
        <div className="p-6 mb-6 bg-white rounded-lg shadow-md">
          <h2 className="flex items-center mb-4 text-lg font-bold">
            <FileText className="mr-2" /> Resume
          </h2>
          <div className="flex justify-between">
            {resumeData.map((item, index) => (
              <div key={index} className="flex flex-col items-center w-1/3 p-4 bg-gray-100 rounded-lg">
                {item.icon}
                <p className="mt-2 font-semibold text-center">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Detail Section */}
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="flex items-center mb-4 text-lg font-bold">
            <FileText className="mr-2" /> Detail
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border border-collapse border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 border border-gray-300">Nama Perangkat</th>
                  <th className="p-2 border border-gray-300">Tipe Sensor</th>
                  <th className="p-2 border border-gray-300">Waktu</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, index) => (
                  <tr key={index} className="text-center border-b border-gray-300">
                    <td className="p-2 border border-gray-300">{row.perangkat}</td>
                    <td className="p-2 border border-gray-300">{row.sensor}</td>
                    <td className="p-2 border border-gray-300">{row.waktu}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </Layout>
    </div>
  );
};

export default History;
