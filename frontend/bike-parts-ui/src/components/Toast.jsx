import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

const Toast = ({ message, type = 'error', onClose }) => {
    useEffect(() => {
        // Automatically close the toast after 5 seconds
        const timer = setTimeout(() => {
            onClose();
        }, 5000);

        return () => {
            clearTimeout(timer);
        };
    }, [onClose]);

    const bgColor = type === 'error' ? 'bg-red-500' : 'bg-green-500';

    return createPortal(
        <div className={`fixed top-5 right-5 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-up ${bgColor}`}>
            <div className="flex items-center">
                <span className="font-semibold mr-3">{type === 'error' ? 'Error' : 'Success'}</span>
                <p>{message}</p>
                <button onClick={onClose} className="ml-4 text-xl font-bold">&times;</button>
            </div>
        </div>,
        document.body
    );
};

export default Toast;