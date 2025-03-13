import React from 'react';
import { Menu, UserCircle } from 'lucide-react';

export default function Topbar() {
    return (
        <div className="bg-gray-300 p-4 flex justify-between items-center shadow-md">
            <button className="md:hidden text-gray-900">
                <Menu size={24} />
            </button>
            <h2 className="text-lg font-bold">Dashboard</h2>
            <UserCircle size={24} className="text-gray-900" />
        </div>
    );
}