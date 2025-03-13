import React from 'react';

export default function TopContainer({ children, icon:Icon, title }) {
    return (
        <div className="bg-gray-200 p-4 rounded-md shadow-md h-40">
            <h3 className="font-bold mb-2 flex items-center">
                <Icon size={20} className="mr-2" /> {title}
            </h3>
            <div className="flex justify-around items-center">
                {children}
            </div>
        </div>
    );
}