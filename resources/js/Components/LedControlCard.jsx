import React from 'react';

export default function LedControlCard({ color, onToggle }) {
    // Menentukan warna teks berdasarkan nama warna
    const colorVariants = {
        Merah: 'text-red-500',
        Kuning: 'text-yellow-500',
        Hijau: 'text-green-500',
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className={`font-bold text-xl ${colorVariants[color]} mb-4`}>LED {color}</h3>
            <div className="flex space-x-4">
                <button 
                    onClick={() => onToggle(color.toLowerCase(), true)} 
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-lg transition"
                >
                    ON
                </button>
                <button 
                    onClick={() => onToggle(color.toLowerCase(), false)} 
                    className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 rounded-lg transition"
                >
                    OFF
                </button>
            </div>
        </div>
    );
}