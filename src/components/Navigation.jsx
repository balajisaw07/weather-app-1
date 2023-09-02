import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/navigation.scss';

function Navigation() {
    return (
        <div className="navigation">
            <div className="logo">
                <Link to="/">MyApp</Link>
            </div>
            <div className="auth-buttons">
                <Link to="/register">
                    <button type="button">Register</button>
                </Link>
                <Link to="/login">
                    <button type="button">Login</button>
                </Link>
            </div>
        </div>
    );
}

export default Navigation;
