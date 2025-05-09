import React, { Children } from 'react';

export default function Topbar({ children }) {
    return (
        <div>
            <nav className="flex justify-between items-center px-8 py-4 shadow-sm">
                <div className="text-xl font-bold text-blue-700">ViewTani</div>
                <div className="space-x-6">
                    {children}
                </div>
            </nav>
        </div>
    );
}