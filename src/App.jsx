import React from 'react';
import AppRouter from './AppRouter';
import Navigation from './components/Navigation';
import { DefaultCountryProvider } from './contexts/DefaultCountryContext';
import Footer from './components/Footer';
import './styles/global.scss';

function App() {
    return (
        <DefaultCountryProvider>
            <div className="App" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <div style={{ flex: '1' }}>
                    <AppRouter>
                        <Navigation />
                    </AppRouter>
                </div>
                <Footer />
            </div>
        </DefaultCountryProvider>
    );
}

export default App;
