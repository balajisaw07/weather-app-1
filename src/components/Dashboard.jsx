import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/dashboard.scss';
import { useDefaultCountry } from '../contexts/DefaultCountryContext';

function Dashboard() {
    const { defaultCountry, setDefaultCountry } = useDefaultCountry();
    const [userData, setUserData] = useState({});
    const [selectedCity, setSelectedCity] = useState('');

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

    const handleCityChange = (e) => {
        setSelectedCity(e.target.value);
    };

    const handleCountryChange = (e) => {
        setDefaultCountry(e.target.value);
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
                <label htmlFor="citySelect">
                    Default City:
                    <select id="citySelect" name="citySelect" onChange={handleCityChange} value={selectedCity}>
                        <option value="London">London</option>
                        <option value="New York">New York</option>
                        <option value="Tokyo">Tokyo</option>
                    </select>
                </label>
                <label htmlFor="countrySelect">
                    Default Country:
                    <select id="countrySelect" name="countrySelect" onChange={handleCountryChange} value={defaultCountry}>
                        <option value="United States">United States</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Japan">Japan</option>
                    </select>
                </label>
            </div>
            <button type="button" onClick={handleLogout}>Logout</button>
        </div>
    );
}

export default Dashboard;
