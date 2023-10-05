import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import '../styles/weather.scss';
import SearchBar from './SearchBar';
import { UserDataContext } from '../contexts/UserDataContext';
import { getCountryFlagURL, fetchLatLon, groupForecastsByDay } from './services/api';
import DayGroup from './DayGroup';

function Weather({ selectedCity }) {
    const apiKey = process.env.REACT_APP_API_KEY;
    const [weather, setWeather] = useState(null);
    const [countries, setCountries] = useState([]);
    const [flagURL, setFlagURL] = useState('');
    const { userData } = useContext(UserDataContext);
    const [expandedDay, setExpandedDay] = useState(null);
    const [currentCity, setCurrentCity] = useState(selectedCity || { lat: 40.7128, lon: -74.0060 });
    const [timezoneOffset, setTimezoneOffset] = useState(0);

    useEffect(() => {
        if (weather) {
            const fetchFlag = async () => {
                const flag = await getCountryFlagURL(weather.city.country);
                setFlagURL(flag);
            };
            fetchFlag();
        }
    }, [weather]);

    useEffect(() => {
        if (userData
            && userData.settings
            && userData.settings.defaultLocation
            && userData.settings.defaultCountry) {
            fetchLatLon(userData.settings.defaultLocation, userData.settings.defaultCountry, apiKey)
                .then(({ lat, lon }) => {
                    setCurrentCity({
                        name: userData.settings.defaultLocation,
                        country: userData.settings.defaultCountry,
                        lat,
                        lon,
                    });
                })
                .catch((error) => {
                    console.error('Failed to fetch lat and lon:', error);
                });
        } else {
            setCurrentCity(selectedCity || { lat: 40.7128, lon: -74.0060 });
        }
    }, [userData, selectedCity]);

    const clearCountries = () => {
        setCountries([]);
    };

    const toggleExpandedDay = (day) => {
        if (expandedDay === day) {
            setExpandedDay(null);
        } else {
            setExpandedDay(day);
        }
    };

    const handleSearch = (searchTerm) => {
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

    const handleCityClick = (city) => {
        setCurrentCity({ lat: city.lat, lon: city.lon });
        setCountries([]);
    };

    useEffect(() => {
        if (currentCity) {
            axios
                .get(`https://api.openweathermap.org/data/2.5/forecast?lat=${currentCity.lat}&lon=${currentCity.lon}&appid=${apiKey}`)
                .then((response) => {
                    setWeather(response.data);
                    setTimezoneOffset(response.data.city.timezone);
                })
                .catch((error) => {
                    console.error('Error fetching weather data: ', error.response ? error.response.data : error);
                });
        }
    }, [currentCity, apiKey]);

    const groupedByDay = weather ? groupForecastsByDay(weather.list) : null;

    return (
        <div className="weather-container">
            <SearchBar
                onSearch={handleSearch}
                countries={countries}
                clearCountries={clearCountries}
                setSelectedCity={handleCityClick}
            />
            {weather ? (
                <div className="weather-card">
                    <h2>
                        Weather Forecast in
                        {' '}
                        {weather.city.name}
                        ,
                        {' '}
                        {weather.city.country}
                        <img className="country-flag" src={flagURL} alt={`Flag of ${weather.city.country}`} />
                    </h2>
                    {Object.keys(groupedByDay).map((day, index) => {
                        const isHeroDay = index === 0;
                        const isExpandedDay = expandedDay === day;
                        const dayGroup = groupedByDay[day].filter((forecast) => {
                            const forecastDate = new Date(forecast.dt * 1000);
                            const localHour = (
                                forecastDate.getUTCHours() + (timezoneOffset / 3600)) % 24;

                            return (isHeroDay || isExpandedDay)
                                ? true : (localHour >= 11 && localHour <= 13);
                        });
                        if (dayGroup.length === 0) {
                            return null;
                        }
                        return (
                            <DayGroup
                                key={day}
                                day={day}
                                index={index}
                                dayGroup={dayGroup}
                                expandedDay={expandedDay}
                                toggleExpandedDay={toggleExpandedDay}
                                timezoneOffset={timezoneOffset}
                            />
                        );
                    })}
                </div>
            ) : (
                <div className="loading">Loading...</div>
            )}
        </div>
    );
}

Weather.propTypes = {
    selectedCity: PropTypes.shape({
        name: PropTypes.string,
        country: PropTypes.string,
        lat: PropTypes.number,
        lon: PropTypes.number,
    }),
};

Weather.defaultProps = {
    selectedCity: {
        name: null,
        country: null,
        lat: 40.7128,
        lon: -74.0060,
    },
};

export default Weather;
