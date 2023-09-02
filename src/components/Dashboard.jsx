import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/dashboard.scss';

function Dashboard() {
    const [userData, setUserData] = useState({});
    const [selectedCity, setSelectedCity] = useState('');

    const fetchUserData = async () => {
        try {
            const res = await axios.get('http://localhost:3000/user/dashboard', {
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
        // Add logic here to update the default city for weather display
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
                {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                <label htmlFor="citySelect">Default City: </label>

                <select id="citySelect" name="citySelect" onChange={handleCityChange} value={selectedCity}>
                    <option value="London">London</option>
                    <option value="New York">New York</option>
                    <option value="Tokyo">Tokyo</option>
                </select>
            </div>

            <button type="button" onClick={handleLogout}>Logout</button>
        </div>
    );
}

export default Dashboard;
