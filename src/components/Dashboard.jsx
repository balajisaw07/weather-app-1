import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Dashboard() {
    const [userData, setUserData] = useState({});
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const res = await axios.get('http://localhost:5000/user/dashboard', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setUserData(res.data.user);
        } catch (err) {
            console.error(err.response.data);
        }
    };

    const handleUpdateProfile = async (updatedData) => {
        setUpdating(true);
        try {
            await axios.put(
                'http://localhost:5000/user/update-profile',
                updatedData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json',
                    },
                },
            );
            await fetchUserData();
            setUpdating(false);
        } catch (err) {
            console.error(err.response.data);
            setUpdating(false);
        }
    };

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
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
}

export default Dashboard;
