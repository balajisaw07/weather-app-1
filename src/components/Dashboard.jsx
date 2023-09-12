import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import '../styles/dashboard.scss';
import '../styles/confirmationmodal.scss';
import SearchBar from './SearchBar';
import ErrorModal from './ErrorModal';
import { UserDataContext } from '../contexts/UserDataContext';

function Dashboard() {
    const { userData, fetchUserData } = useContext(UserDataContext);
    const [selectedCity, setSelectedCity] = useState(null);
    const [countries, setCountries] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [, setSearchTerm] = useState('');
    const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState(false);
    const [saveModalMessage, setSaveModalMessage] = useState(null);

    useEffect(() => {
        fetchUserData();
    }, []);

    useEffect(() => {
        if (userData && userData.settings && userData.settings.defaultLocation) {
            setSelectedCity({
                name: userData.settings.defaultLocation,
                country: userData.settings.defaultCountry,
            });
        }
    }, [userData]);

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

    const handleSave = async () => {
        if (!selectedCity
            || (userData.settings
                && selectedCity.name
                === userData.settings.defaultLocation)) {
            setShowModal(true);
            setSaveModalMessage('No changes made.');
            setTimeout(() => { setShowModal(false); setSaveModalMessage(null); }, 3000);
            return;
        }

        if (userData.settings && userData.settings.defaultLocation) {
            setShowConfirmationModal(true);
        } else {
            const backendUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000';
            const payload = { selectedCity };
            try {
                await axios.put(`${backendUrl}/user/update-profile`, payload, {
                    headers: {
                        'x-auth-token': localStorage.getItem('token'),
                    },
                });
                fetchUserData();
                setShowModal(true);
                setTimeout(() => setShowModal(false), 3000);
            } catch (err) {
                console.error('Failed to save settings', err);
            }
        }
    };

    const handleConfirmedSave = async () => {
        setShowConfirmationModal(false);
        const backendUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000';
        const payload = { selectedCity };

        try {
            await axios.put(`${backendUrl}/user/update-profile`, payload, {
                headers: {
                    'x-auth-token': localStorage.getItem('token'),
                },
            });
            fetchUserData();
            setShowModal(true);
            setTimeout(() => setShowModal(false), 3000);
        } catch (err) {
            console.error('Failed to save settings', err);
        }

        setSaveModalMessage('Default location updated!');
        setTimeout(() => setSaveModalMessage(null), 3000);
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
            fetchUserData();
        } catch (err) {
            console.error('Failed to remove default location', err);
        }
    };

    const handleDeleteCancel = () => {
        setShowDeleteConfirmationModal(false);
    };

    const getModalMessage = () => {
        if (showConfirmationModal) {
            return 'Do you want to overwrite your default location?';
        }
        if (saveModalMessage) {
            return saveModalMessage;
        }
        if (userData.settings && userData.settings.defaultLocation && !saveModalMessage) {
            return 'Default location selected!';
        }
        return 'Default location selected!';
    };

    return (
        <div className="dashboard-container">
            <h1>User Dashboard</h1>
            <p>
                Welcome,
                <strong>
                    {' '}
                    {userData ? userData.username : 'Guest'}
                    !
                </strong>
            </p>
            <div>
                <h2>Profile Information</h2>
                <p>
                    <strong>Username:</strong>
                    {' '}
                    {userData ? userData.username : 'Guest'}
                </p>
                <p>
                    <strong>Email:</strong>
                    {' '}
                    {userData ? userData.email : 'N/A'}
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
