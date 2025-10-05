import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import BikePartList from './components/BikePartList.jsx';
import Header from './components/Header.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import { ErrorProvider, useError } from './context/ErrorContext.jsx';
import { setupErrorInterceptor } from './service/api.js';

import './animations.css';

const AppWithInterceptor = ({ children }) => {
    const { showError } = useError();
    
    useEffect(() => {
        setupErrorInterceptor(showError);
    }, [showError]);

    return <>{children}</>;
};


function App() {
  return (
    <ErrorProvider>
      <Router>
        <AppWithInterceptor>
          <div className="App min-h-screen bg-gray-100">
            <Header />
            <main className="container mx-auto p-4 md:p-8">
              <ErrorBoundary>
                <Switch>
                  <Route path="/" exact component={BikePartList} />
                </Switch>
              </ErrorBoundary>
            </main>
          </div>
        </AppWithInterceptor>
      </Router>
    </ErrorProvider>
  );
}

export default App;