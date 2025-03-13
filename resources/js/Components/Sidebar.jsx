import React from 'react';
import { Link } from '@inertiajs/react';
import { LayoutDashboard, HardDrive, History, FileText } from 'lucide-react';

export default function Sidebar() {
    return (
        <div className="bg-gray-800 text-white w-64 min-h-screen p-5 h-full">
            <h1 className="text-xl font-bold mb-6">View Tani</h1>
            <ul>
                <li className="mb-4">
                    <Link href="/dashboard" className="flex items-center space-x-2 hover:text-gray-300">
                        <LayoutDashboard size={20} />
                        <span>Dashboard</span>
                    </Link>
                </li>
                <li className="mb-4">
                    <Link href="/device" className="flex items-center space-x-2 hover:text-gray-300">
                        <HardDrive size={20} />
                        <span>Device</span>
                    </Link>
                </li>
                <li className="mb-4">
                    <Link href="/history" className="flex items-center space-x-2 hover:text-gray-300">
                        <History size={20} />
                        <span>History</span>
                    </Link>
                </li>
                <li className="mb-4">
                    <Link href="/report" className="flex items-center space-x-2 hover:text-gray-300">
                        <FileText size={20} />
                        <span>Report</span>
                    </Link>
                </li>
            </ul>
        </div>
    );
}