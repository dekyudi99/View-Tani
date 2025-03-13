import React from 'react';

export default function BottomContainer({ children, icon:Icon, title }) {
    return (
        <div className="bg-gray-200 p-4 rounded-md shadow-md mt-4 h-80">
            <h3 className="font-bold mb-2 flex items-center">
                <Icon size={20} className="mr-2" /> {title}
            </h3>
            <div className="w-full h-64 bg-white rounded-md">
                {children}
            </div>
        </div>
    );
}