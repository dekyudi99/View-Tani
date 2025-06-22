import React from 'react';

// Komponen kecil untuk ikon
const StatCardIcon = ({ children }) => (
    <div className="p-3 bg-gray-200 rounded-full">{children}</div>
);

// Komponen untuk satu kartu statistik
export default function StatCard({ title, value, unit, icon }) {
    return (
        <div className="bg-white p-6 rounded-xl shadow-md flex items-center space-x-4">
            <StatCardIcon>{icon}</StatCardIcon>
            <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <p className="text-2xl font-bold text-gray-800">
                    {/* Menampilkan angka dengan 1 desimal, atau '-' jika data null */}
                    {typeof value === 'number' ? value.toFixed(1) : '-'} <span className="text-lg font-normal">{unit}</span>
                </p>
            </div>
        </div>
    );
}