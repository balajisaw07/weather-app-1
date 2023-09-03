import React from 'react';
import Weather from './Weather';
import '../styles/home.scss';
import { useDefaultCountry } from '../contexts/DefaultCountryContext';

function Home() {
    const { defaultCountry } = useDefaultCountry();
    return (
        <div className="home-container">
            <Weather cityId="5128581" country={defaultCountry} />
        </div>
    );
}

export default Home;
