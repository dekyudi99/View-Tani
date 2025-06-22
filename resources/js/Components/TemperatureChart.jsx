import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function TemperatureChart({ history }) {
    const [chartData, setChartData] = useState({ labels: [], datasets: [] });
    const chartOptions = { responsive: true, maintainAspectRatio: false };

    useEffect(() => {
        if (history && history.length > 0) {
            setChartData({
                labels: history.map(d => new Date(d.time).toLocaleTimeString('id-ID')),
                datasets: [{
                    label: 'Suhu (°C)',
                    data: history.map(d => d.value),
                    backgroundColor: 'rgba(239, 68, 68, 0.6)',
                }],
            });
        }
    }, [history]); // Efek ini hanya bergantung pada data riwayat suhu

    return (
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md" style={{ height: '450px' }}>
            <h2 className="text-xl font-bold text-gray-700 mb-4">Riwayat Suhu (1 Jam Terakhir)</h2>
            {history && history.length > 0 ? (
                <Bar options={chartOptions} data={chartData} />
            ) : (
                <div className="flex justify-center items-center h-full text-gray-500">
                    <p>Menunggu data untuk grafik...</p>
                </div>
            )}
        </div>
    );
}