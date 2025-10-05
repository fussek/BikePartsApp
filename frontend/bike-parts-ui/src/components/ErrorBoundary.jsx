import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative text-center" role="alert">
                    <strong className="font-bold">Something went wrong.</strong>
                    <p className="block sm:inline">We're sorry, there was a technical issue. Please try refreshing the page.</p>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;