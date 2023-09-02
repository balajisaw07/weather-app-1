import React from 'react';
import AppRouter from './AppRouter';
import Navigation from './components/Navigation';

function App() {
    return (
        <div className="App">
            <AppRouter>
                <Navigation />
            </AppRouter>
        </div>
    );
}

export default App;
