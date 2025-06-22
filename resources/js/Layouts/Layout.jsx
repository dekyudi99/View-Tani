import React, { useState } from 'react';
import Sidebar from '@/Components/Sidebar';
import Topbar from '@/Components/Topbar';

export default function ViewDashboard({ children, header }) {
    const [isSidebarVisible, setIsSidebarVisible] = useState(true);

    // Class untuk menggeser konten saat sidebar disembunyikan
    const contentStyle = `transition-all duration-300 ease-in-out ${isSidebarVisible ? 'ml-64' : 'ml-0'}`;

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <Sidebar isVisible={isSidebarVisible} />

            {/* Main Content */}
            <div className={`flex-1 flex flex-col ${contentStyle}`}>
                {/* Topbar */}
                <Topbar header={header} setView={setIsSidebarVisible} isVisible={isSidebarVisible} />

                {/* Content */}
                <div className="p-6 bg-gray-100 flex flex-col gap-4">
                    {children}
                </div>
            </div>
        </div>
    );
}
