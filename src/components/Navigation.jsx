import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/navigation.scss';

function Navigation() {
    return (
        <div className="navigation">
            <div className="logo">
                <Link to="/">
                    <img src="/sun.png" alt="Weather App Logo" className="logo-img" />
                    <h1>Weather App</h1>
                </Link>
            </div>
            <div className="login">
                <Link to="/login">
                    <button type="button" className="login-btn">Login</button>
                </Link>
                <Link to="/register">
                    <button type="button" className="register-btn">Register</button>
                </Link>
            </div>
        </div>
    );
}

export default Navigation;
