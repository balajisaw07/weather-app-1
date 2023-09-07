import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/dashboard.scss';
import SearchBar from './SearchBar';

function Dashboard() {
    const [userData, setUserData] = useState({});
    // eslint-disable-next-line no-unused-vars
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null);
    const [countries, setCountries] = useState([]);

    const fetchUserData = async () => {
        const backendUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000';
        try {
            const res = await axios.get(`${backendUrl}/user/dashboard`, {
                headers: {
                    'x-auth-token': localStorage.getItem('token'),
                },
            });
            setUserData(res.data.user);
        } catch (err) {
            console.error(err.response.data);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    const handleSearch = (searchTerm) => {
        const apiKey = process.env.REACT_APP_API_KEY;

        if (searchTerm.length > 2) {
            fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${searchTerm}&limit=5&appid=${apiKey}`)
                .then((response) => response.json())
                .then((data) => {
                    setCountries(data);
                })
                .catch((error) => console.error(error));
        } else {
            setCountries([]);
        }
    };

    const clearCountries = () => {
        setCountries([]);
    };

    const handleCityClick = (city) => {
        setSelectedCity({ lat: city.lat, lon: city.lon });
        setSelectedLocation(city);
        setCountries([]);
    };
    const handleSave = async () => {
        const backendUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000';
        const payload = {
            selectedCity,
        };
        try {
            await axios.put(`${backendUrl}/user/update-profile`, payload, {
                headers: {
                    'x-auth-token': localStorage.getItem('token'),
                },
            });
        } catch (err) {
            console.error('Failed to save settings', err);
        }
    };

    return (
        <div className="dashboard-container">
            <h1>User Dashboard</h1>
            <p>
                Welcome,
                {' '}
                {userData.username}
                !
            </p>
            <div>
                <h2>Profile Information</h2>
                <p>
                    Username:
                    {' '}
                    {userData.username}
                </p>
                <p>
                    Email:
                    {' '}
                    {userData.email}
                </p>
            </div>
            <div>
                <h2>Weather Settings</h2>
                <p>Your default location:</p>
                <SearchBar
                    onSearch={handleSearch}
                    countries={countries}
                    clearCountries={clearCountries}
                    setSelectedCity={handleCityClick}
                    variant="dashboard"
                />
                {selectedLocation && (
                    <div className="selected-location-card">
                        <h4>Selected Location:</h4>
                        <p>{`${selectedLocation.name}, ${selectedLocation.country}`}</p>
                    </div>
                )}
            </div>
            <button type="button" onClick={handleSave}>Save Settings</button>
            <button type="button" className="register-btn" onClick={handleLogout}>Logout</button>
        </div>
    );
}

export default Dashboard;
