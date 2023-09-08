import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/dashboard.scss';
import '../styles/confirmationmodal.scss';
import SearchBar from './SearchBar';
import ErrorModal from './ErrorModal';

function Dashboard() {
    const [userData, setUserData] = useState({});
    const [selectedCity, setSelectedCity] = useState(null);
    const [countries, setCountries] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState(false);

    const fetchUserData = async () => {
        const backendUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000';
        try {
            const res = await axios.get(`${backendUrl}/user/dashboard`, {
                headers: {
                    'x-auth-token': localStorage.getItem('token'),
                },
            });
            setUserData(res.data.user);
            if (res.data.user.settings && res.data.user.settings.defaultLocation) {
                setSelectedCity({
                    name: res.data.user.settings.defaultLocation,
                    country: res.data.user.settings.defaultCountry,
                });
            }
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
        setSearchTerm(searchTerm);
        if (searchTerm.length > 2) {
            fetch(
                `https://api.openweathermap.org/geo/1.0/direct?q=${searchTerm}`
                + `&limit=5&appid=${apiKey}`,
            )
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
        setSelectedCity({
            name: city.name,
            country: city.country,
            lat: city.lat,
            lon: city.lon,
        });
    };

    const handleSave = () => {
        if (
            !selectedCity
            || (userData.settings && selectedCity.name === userData.settings.defaultLocation)
        ) {
            setShowModal(true);
            setTimeout(() => setShowModal(false), 3000);
        } else {
            setShowConfirmationModal(true);
        }
    };

    const handleConfirmedSave = async () => {
        setShowConfirmationModal(false);
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
            setShowModal(true);
            setTimeout(() => setShowModal(false), 3000);
        } catch (err) {
            console.error('Failed to save settings', err);
        }
    };

    const handleCancel = () => {
        setShowConfirmationModal(false);
    };

    const handleRemoveSelectedCityClick = () => {
        setShowDeleteConfirmationModal(true);
    };

    const handleRemoveSelectedCity = async () => {
        setShowDeleteConfirmationModal(false);
        const backendUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000';
        const payload = {
            selectedCity: null,
        };
        try {
            await axios.put(`${backendUrl}/user/update-profile`, payload, {
                headers: {
                    'x-auth-token': localStorage.getItem('token'),
                },
            });
            setSelectedCity(null);
        } catch (err) {
            console.error('Failed to remove default location', err);
        }
    };

    const handleDeleteCancel = () => {
        setShowDeleteConfirmationModal(false);
    };

    const getModalMessage = () => {
        if (!selectedCity && (!userData.settings || !userData.settings.defaultLocation)) {
            return 'No changes made.';
        }
        if (userData.settings && userData.settings.defaultLocation) {
            if (selectedCity && selectedCity.name === userData.settings.defaultLocation) {
                return 'No changes to be made';
            }
            return 'Default location updated successfully!';
        }
        return `Default location set as ${selectedCity ? selectedCity.name : searchTerm}`;
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
                <SearchBar
                    onSearch={handleSearch}
                    countries={countries}
                    clearCountries={clearCountries}
                    setSelectedCity={handleCityClick}
                    variant="dashboard"
                />
                {showConfirmationModal && (
                    <div className="confirmation-modal">
                        <div className="confirmation-modal-content">
                            <span
                                role="button"
                                tabIndex="0"
                                className="error-modal-close"
                                onClick={handleCancel}
                                onKeyDown={handleCancel}
                            >
                                &times;
                            </span>
                            <p>{getModalMessage()}</p>
                            <button type="button" className="yes-button" onClick={handleConfirmedSave}>Yes</button>
                            <button type="button" className="no-button" onClick={handleCancel}>No</button>
                        </div>
                    </div>
                )}
                {showDeleteConfirmationModal && (
                    <div className="confirmation-modal">
                        <div className="confirmation-modal-content">
                            <span
                                role="button"
                                tabIndex="0"
                                className="error-modal-close"
                                onClick={handleDeleteCancel}
                                onKeyDown={handleDeleteCancel}
                            >
                                &times;
                            </span>
                            <p>Do you want to delete the default location?</p>
                            <button type="button" className="yes-button" onClick={handleRemoveSelectedCity}>Yes</button>
                            <button type="button" className="no-button" onClick={handleDeleteCancel}>No</button>
                        </div>
                    </div>
                )}
                {selectedCity && (
                    <div className="selected-location-card">
                        <h4>Selected Location:</h4>
                        <p>
                            {`${selectedCity.name}, ${selectedCity.country}`}
                            <span
                                role="button"
                                tabIndex="0"
                                className="cancel-icon"
                                onClick={handleRemoveSelectedCityClick}
                                onKeyDown={handleRemoveSelectedCityClick}
                            >
                                &#10006;
                            </span>
                        </p>
                    </div>
                )}
            </div>
            <button type="button" onClick={handleSave}>
                Save
            </button>
            <button type="button" className="register-btn" onClick={handleLogout}>Logout</button>
            {showModal && (
                <ErrorModal
                    message={getModalMessage()}
                    onClose={() => setShowModal(false)}
                />
            )}
        </div>
    );
}

export default Dashboard;
