import React, { useEffect, useState } from 'react';

const Toast = ({ type, message, onClose, duration = 3000 }) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
            onClose?.();
        }, duration);
        return () => clearTimeout(timer);
    }, [onClose, duration]);

    if (!visible) return null;

    const baseStyle = 'rounded-2xl px-4 py-3 shadow-lg text-sm font-medium flex items-center space-x-2 transition-opacity duration-500 max-w-xs';

    const colorMap = {
        success: 'bg-green-300 text-white',
        error: 'bg-red-300 text-white',
    };

    const labelMap = {
        success: '✅',
        error: '❌',
    };

    return (
        <div className={`${baseStyle} ${colorMap[type] || 'bg-gray-500 text-white'}`}>
            <span>{labelMap[type] || 'ℹ️'}</span>
            <span className='text-black'>{message}</span>
        </div>
    );
};

export default Toast;
