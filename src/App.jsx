import React from 'react';
import AppRouter from './AppRouter';
import Navigation from './components/Navigation';
import { DefaultCountryProvider } from './contexts/DefaultCountryContext';

function App() {
    return (
        <DefaultCountryProvider>
            {' '}
            <div className="App">
                <AppRouter>
                    <Navigation />
                </AppRouter>
            </div>
        </DefaultCountryProvider>
    );
}

export default App;
