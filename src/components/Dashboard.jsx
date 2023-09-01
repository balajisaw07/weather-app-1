import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Dashboard() {
    const [userData, setUserData] = useState({});

    const fetchUserData = async () => {
        try {
            const res = await axios.get('http://localhost:3000/user/dashboard', {
                headers: {
                    'x-auth-token': localStorage.getItem('token'),
                },
            });
            console.log('API Response:', res.data); // Log the API response
            setUserData(res.data.user);
            console.log('Updated State:', userData); // Log the updated state
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

    return (
        <div>
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
            <button type="button" onClick={handleLogout}>Logout</button>
        </div>
    );
}

export default Dashboard;
