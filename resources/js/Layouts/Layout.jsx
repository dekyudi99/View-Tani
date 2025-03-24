import React from 'react'
import Sidebar from '@/Components/Sidebar';
import Topbar from '@/Components/Topbar';
import { useState } from 'react';

export default function ViewDashboard({ children, header }) {
    const [isSidebarVisible, setIsSidebarVisible] = useState(true);
    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <Sidebar isVisible={isSidebarVisible}/>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Topbar */}
                <Topbar header={header} setView={setIsSidebarVisible} isVisible={isSidebarVisible}/>

                {/* Content */}
                <div className="p-6 bg-gray-100 flex flex-col gap-4 ml-64">
                    {children}
                </div>
            </div>
        </div>
    );
}