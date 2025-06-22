import React from 'react';
import LedControlCard from '@/Components/LedControlCard';

export default function ControlPanel({ onToggleLed }) {
    const ledColors = ['Merah', 'Kuning', 'Hijau'];

    return (
        <div className="lg:col-span-1 flex flex-col space-y-6">
            {ledColors.map(color => (
                <LedControlCard key={color} color={color} onToggle={onToggleLed} />
            ))}
        </div>
    );
}