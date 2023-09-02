import React from 'react';
import Weather from './Weather';
import '../styles/home.scss';

function Home() {
    return (
        <div className="home-container">
            <Weather cityId="524901" />
        </div>
    );
}

export default Home;
