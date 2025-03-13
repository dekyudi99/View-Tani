import React, { Children } from 'react'
import Sidebar from '@/Components/Sidebar';
import Topbar from '@/Components/Topbar';

export default function ViewDashboard({ children, header }) {
    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Topbar */}
                <Topbar header={header} />

                {/* Dashboard Content */}
                <div className="p-6 bg-gray-100 flex flex-col gap-4">
                    {children}
                </div>
            </div>
        </div>
    );
}