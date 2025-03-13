import React from 'react';
import { BarChart2 } from 'lucide-react';

export default function BottomContainer() {
    return (
        <div className="bg-gray-200 p-4 rounded-md shadow-md mt-4 h-80">
            <h3 className="font-bold mb-2 flex items-center">
                <BarChart2 size={20} className="mr-2" /> Graph
            </h3>
            <div className="w-full h-64 bg-black rounded-md"></div>
        </div>
    );
}