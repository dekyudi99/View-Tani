import React from 'react';

export default function ToggleSwitch({ isActive, label, onChange, color }) {
  return (
    <label className="inline-flex items-center cursor-pointer">
      <span className="mr-2 text-sm font-medium">{label}</span>
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={isActive}
          onChange={onChange}
        />
        <div className={`w-11 h-6 bg-gray-200 rounded-full peer ${color}`}></div>
        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition peer-checked:translate-x-full"></div>
      </div>
    </label>
  );
}