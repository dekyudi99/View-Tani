import React from 'react';

export default function Checkbox({ className = '', ...props }) {
    return (
        <input
            {...props}
            type="checkbox"
            className={
                'rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2 focus:outline-none ' +
                className
            }
        />
    );
}