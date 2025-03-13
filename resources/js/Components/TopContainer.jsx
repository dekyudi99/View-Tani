import React from 'react';
import { Gauge } from 'lucide-react';

export default function TopContainer() {
    return (
        <div className="bg-gray-200 p-4 rounded-md shadow-md h-40">
            <h3 className="font-bold mb-2 flex items-center">
                <Gauge size={20} className="mr-2" /> Perangkat 1
            </h3>
            <div className="flex justify-around items-center">
                {[1, 2, 3, 4, 5].map((num) => (
                    <div key={num} className="text-center">
                        <Gauge size={40} />
                        <p>Parameter {num}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}