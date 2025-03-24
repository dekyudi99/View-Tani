import React from 'react';
import { Menu, UserCircle } from 'lucide-react';

export default function Topbar({ header, setView }) {
    return (
        <div className={`bg-gray-300 p-4 flex justify-between items-center shadow-md sticky top-0`}>
            <div className='flex items-center flex-row gap-4'>
                <button className="text-gray-900" onClick={() => setView((prev) => !prev)}>
                    <Menu size={24} />
                </button>
                <h2 className="text-lg font-bold">{header}</h2>
            </div>
            <UserCircle size={24} className="text-gray-900" />
        </div>
    );
}