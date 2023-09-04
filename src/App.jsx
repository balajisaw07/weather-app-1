import React from 'react';
import AppRouter from './AppRouter';
import Navigation from './components/Navigation';
import { DefaultCountryProvider } from './contexts/DefaultCountryContext';
import Footer from './components/Footer';

function App() {
    return (
        <DefaultCountryProvider>
            {' '}
            <div className="App">
                <AppRouter>
                    <Navigation />
                </AppRouter>
                <Footer />
            </div>
        </DefaultCountryProvider>
    );
}

export default App;
