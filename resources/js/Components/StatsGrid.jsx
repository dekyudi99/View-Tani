import React from 'react';
import StatCard from '@/Components/StatCard'; // Menggunakan alias '@' untuk path absolut

export default function StatsGrid({ stats }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard title="Suhu" value={stats.temperature} unit="°C" icon="🌡️" />
            <StatCard title="Kelembapan Udara" value={stats.humidity} unit="%" icon="💧" />
            <StatCard title="Kelembapan Tanah" value={stats.soil_moisture} unit="%" icon="🌱" />
        </div>
    );
}