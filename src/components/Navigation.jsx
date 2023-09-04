import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/navigation.scss';

function Navigation() {
    // State to hold the login status
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Check the login status when the component mounts
    useEffect(() => {
        const userToken = localStorage.getItem('token');
        setIsLoggedIn(Boolean(userToken));

        // Function to run whenever local storage changes
        const onStorageChange = () => {
            const updatedUserToken = localStorage.getItem('token');
            setIsLoggedIn(Boolean(updatedUserToken));
        };

        // Add the event listener
        window.addEventListener('storage', onStorageChange);

        // Remove event listener on cleanup
        return () => {
            window.removeEventListener('storage', onStorageChange);
        };
    }, []);

    // Function to handle logout
    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/';
    };

    return (
        <div className="navigation">
            <div className="logo">
                <Link to="/">
                    <img src="/sun.png" alt="Weather App Logo" className="logo-img" />
                    <h1>Weather App</h1>
                </Link>
            </div>
            <div className="login">
                {isLoggedIn ? (
                    <>
                        <Link to="/dashboard">
                            <button type="button" className="login-btn">Dashboard</button>
                        </Link>
                        <button type="button" className="register-btn" onClick={handleLogout}>Log Out</button>
                    </>
                ) : (
                    <>
                        <Link to="/login">
                            <button type="button" className="login-btn">Login</button>
                        </Link>
                        <Link to="/register">
                            <button type="button" className="register-btn">Register</button>
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
}

export default Navigation;
