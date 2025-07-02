import React from 'react';
import BackButton from '@/Components/BackButton';

export default function Authenticated({header, children }) {

    return (
        <div className="min-h-screen bg-gray-100">
            {header && (
                <header className="flex flex-row justify-between items-baseline bg-white dark:bg-gray-100 shadow">
                    <div className="max-w-7xl py-6 px-4 sm:px-6 lg:px-8">{header}</div>
                    <div className='mr-8'>
                        <BackButton/>
                    </div>
                </header>
            )}

            <main>{children}</main>
        </div>
    );
}