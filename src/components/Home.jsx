import React from 'react';
import Weather from './Weather';
import '../styles/home.scss';

function Home() {
    return (
        <div className="home-container">
            <h1>Weather App</h1>
            <Weather cityId="524901" />
        </div>
    );
}

export default Home;
