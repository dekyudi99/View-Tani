import React, { useState, useEffect } from 'react';
import { router, Link, usePage } from '@inertiajs/react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// ---- Komponen-komponen UI ----

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Kartu untuk menampilkan statistik utama (Suhu, dll.)
const StatCard = ({ title, value, unit, icon }) => (
    <div className="bg-white p-6 rounded-xl shadow-md flex items-center space-x-4">
        <div className="p-3 bg-gray-200 rounded-full">{icon}</div>
        <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-gray-800">
                {typeof value === 'number' ? value.toFixed(1) : '-'} <span className="text-lg font-normal">{unit}</span>
            </p>
        </div>
    </div>
);

// Kartu untuk tombol kontrol Pompa Air Manual
const SolenoidControl = ({ onToggle, disabled }) => (
    <div className={`bg-white p-6 rounded-xl shadow-md ${disabled ? 'opacity-50' : ''}`}>
        <h3 className={`font-bold text-xl mb-4 ${disabled ? 'text-gray-400' : 'text-blue-500'}`}>Kontrol Pompa Manual</h3>
        <div className="flex space-x-4">
            <button onClick={() => onToggle(true)} disabled={disabled} className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-lg transition disabled:cursor-not-allowed">ON</button>
            <button onClick={() => onToggle(false)} disabled={disabled} className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 rounded-lg transition disabled:cursor-not-allowed">OFF</button>
        </div>
        {disabled && <p className="text-xs text-center mt-2 text-gray-500">Aktifkan mode Manual untuk menggunakan.</p>}
    </div>
);

// Kartu untuk menampilkan status (Indikator)
const IndicatorCard = ({ title, statusText, colorClass }) => (
    <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="font-bold text-xl text-gray-700 mb-4">{title}</h3>
        <div className="flex items-center space-x-3">
            <span className={`h-4 w-4 rounded-full ${colorClass}`}></span>
            <span className="font-semibold text-lg text-gray-800">{statusText}</span>
        </div>
    </div>
);

// Komponen untuk menampilkan Grafik
const SensorChart = ({ history, chartConfig }) => {
    const [chartData, setChartData] = useState({ labels: [], datasets: [] });
    const chartOptions = { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: false } } };

    useEffect(() => {
        if (history && history.length > 0) {
            setChartData({
                labels: history.map(d => new Date(d.time).toLocaleTimeString('id-ID')),
                datasets: [{
                    label: chartConfig.label,
                    data: history.map(d => d.value),
                    backgroundColor: chartConfig.color,
                }],
            });
        } else {
            setChartData({ labels: [], datasets: [] });
        }
    }, [history, chartConfig]);

    return (
        <div className="bg-white p-6 rounded-xl shadow-md" style={{ height: '450px' }}>
            {history && history.length > 0 ? (
                <Bar options={chartOptions} data={chartData} />
            ) : (
                <div className="flex justify-center items-center h-full text-gray-500">
                    <p>Menunggu data untuk grafik...</p>
                </div>
            )}
        </div>
    );
};

// Komponen untuk Mode Switch (Otomatis/Manual)
const ModeControl = ({ currentMode, onModeChange }) => (
    <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="font-bold text-xl text-gray-700 mb-4">Mode Kontrol Pompa</h3>
        <div className="flex items-center justify-center p-1 rounded-full bg-gray-200">
            <button onClick={() => onModeChange('auto')} className={`w-full py-2 rounded-full text-sm font-bold transition ${currentMode === 'auto' ? 'bg-blue-500 text-white shadow' : 'text-gray-600'}`}>
                Otomatis
            </button>
            <button onClick={() => onModeChange('manual')} className={`w-full py-2 rounded-full text-sm font-bold transition ${currentMode === 'manual' ? 'bg-blue-500 text-white shadow' : 'text-gray-600'}`}>
                Manual
            </button>
        </div>
    </div>
);


// ---- Komponen Utama Dashboard ----
export default function Dashboard({ currentStats, chartHistory, activeChart, solenoidStatus, lightStatus, controlMode: initialControlMode }) {
    // Mengambil data auth global yang dibagikan oleh HandleInertiaRequests.php
    const { auth } = usePage().props;
    const deviceId = 'perangkat_1';
    
    // State untuk UI yang interaktif dan responsif
    const [selectedChart, setSelectedChart] = useState(activeChart);
    const [currentSolenoidStatus, setCurrentSolenoidStatus] = useState(solenoidStatus);
    const [controlMode, setControlMode] = useState(initialControlMode);

    // Sinkronkan state lokal jika props dari server berubah (setelah auto-refresh)
    useEffect(() => { setCurrentSolenoidStatus(solenoidStatus); }, [solenoidStatus]);
    useEffect(() => { setControlMode(initialControlMode); }, [initialControlMode]);
    
    // Konfigurasi untuk setiap jenis grafik
    const chartConfigs = {
        temperature: { label: 'Suhu (°C)', color: 'rgba(239, 68, 68, 0.6)' },
        humidity: { label: 'Kelembapan (%)', color: 'rgba(59, 130, 246, 0.6)' },
        soil_moisture: { label: 'Kelembapan Tanah (%)', color: 'rgba(34, 197, 94, 0.6)' }
    };

    // Konfigurasi untuk teks dan warna indikator lampu
    const lightIndicatorConfig = {
        merah: { text: "Panas", class: "bg-red-500 animate-pulse" },
        kuning: { text: "Hangat", class: "bg-yellow-500" },
        hijau: { text: "Normal", class: "bg-green-500" },
        unknown: { text: "N/A", class: "bg-gray-400" },
    };

    // Fungsi untuk mengubah grafik saat dropdown dipilih
    const handleChartChange = (newChartType) => {
        setSelectedChart(newChartType);
        router.get(route('dashboard'), { chart: newChartType }, {
            preserveState: true,
            replace: true,
        });
    };

    // Fungsi untuk kontrol solenoid (dengan update UI instan)
    const toggleSolenoid = (state) => {
        setCurrentSolenoidStatus(state);
        router.post('/dashboard/control', {
            command: 'solenoid', state: state, device_id: deviceId,
        }, { preserveState: true, preserveScroll: true });
    };

    // Fungsi untuk mengubah mode kontrol (dengan update UI instan)
    const handleModeChange = (newMode) => {
        setControlMode(newMode);
        router.post(route('dashboard.setMode'), {
            mode: newMode, device_id: deviceId,
        }, { preserveState: true, preserveScroll: true });
    };

    // Auto-refresh data dari server
    useEffect(() => {
        const interval = setInterval(() => {
            router.reload({ only: ['currentStats', 'chartHistory', 'solenoidStatus', 'lightStatus', 'controlMode'], preserveState: true });
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-gray-100 min-h-screen">
            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                {/* Header dengan Judul, Profil, dan Logout */}
                <header className="flex flex-row justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Dashboard ViewTani</h1>
                    <div className="flex items-center space-x-4 text-sm font-medium">
                        <Link href={route('profile.edit')} className="text-gray-600 hover:text-blue-600">
                            {auth?.user?.name}
                        </Link>
                        <span className="text-gray-300">|</span>
                        <Link href={route('logout')} method="post" as="button" className="text-gray-600 hover:text-blue-600">
                            Log Out
                        </Link>
                    </div>
                </header>
                
                <main>
                    {/* Grid untuk Kartu Statistik Utama */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <StatCard title="Suhu" value={currentStats.temperature} unit="°C" icon="🌡️" />
                        <StatCard title="Kelembapan Udara" value={currentStats.humidity} unit="%" icon="💧" />
                        <StatCard title="Kelembapan Tanah" value={currentStats.soil_moisture} unit="%" icon="🌱" />
                    </div>
                    
                    {/* Grid Utama untuk Kontrol dan Grafik */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Kolom Kiri: Kontrol & Indikator */}
                        <div className="lg:col-span-1 flex flex-col space-y-6">
                            <ModeControl currentMode={controlMode} onModeChange={handleModeChange} />
                            <SolenoidControl onToggle={toggleSolenoid} disabled={controlMode === 'auto'} />
                            <IndicatorCard 
                                title="Status Pompa" 
                                statusText={currentSolenoidStatus ? 'MENYALA' : 'MATI'} 
                                colorClass={currentSolenoidStatus ? 'bg-green-500 animate-pulse' : 'bg-red-500'}
                            />
                            <IndicatorCard 
                                title="Indikator Suhu" 
                                statusText={lightIndicatorConfig[lightStatus]?.text || 'N/A'}
                                colorClass={lightIndicatorConfig[lightStatus]?.class || 'bg-gray-400'}
                            />
                        </div>
                        
                        {/* Kolom Kanan: Grafik dengan Dropdown */}
                        <div className="lg:col-span-2">
                            <div className="flex justify-between items-center mb-4">
                               <h2 className="text-xl font-bold text-gray-700">Riwayat Sensor (1 Jam Terakhir)</h2>
                               <select 
                                    value={selectedChart}
                                    onChange={(e) => handleChartChange(e.target.value)}
                                    className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-48 p-2.5"
                                >
                                    <option value="temperature">Suhu</option>
                                    <option value="humidity">Kelembapan Udara</option>
                                    <option value="soil_moisture">Kelembapan Tanah</option>
                                </select>
                            </div>
                            <SensorChart history={chartHistory} chartConfig={chartConfigs[selectedChart]} />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}