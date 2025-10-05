import React, { createContext, useState, useContext } from 'react';
import Toast from '../components/Toast.jsx';

const ErrorContext = createContext();

export const useError = () => {
    return useContext(ErrorContext);
};

export const ErrorProvider = ({ children }) => {
    const [error, setError] = useState(null);

    const showError = (message) => {
        setError(message);
    };

    const hideError = () => {
        setError(null);
    };

    return (
        <ErrorContext.Provider value={{ showError }}>
            {children}
            {error && <Toast message={error} onClose={hideError} />}
        </ErrorContext.Provider>
    );
};