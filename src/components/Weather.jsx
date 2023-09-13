import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import '../styles/weather.scss';
import SearchBar from './SearchBar';
import { UserDataContext } from '../contexts/UserDataContext';

function Weather({ selectedCity }) {
    const apiKey = process.env.REACT_APP_API_KEY;
    const [weather, setWeather] = useState(null);
    const [countries, setCountries] = useState([]);
    const [flagURL, setFlagURL] = useState('');
    const { userData } = useContext(UserDataContext);
    const [expandedDay, setExpandedDay] = useState(null);
    const [currentCity, setCurrentCity] = useState(selectedCity || { lat: 40.7128, lon: -74.0060 });
    const [timezoneOffset, setTimezoneOffset] = useState(0);

    const getCountryFlagURL = async (countryCode) => {
        try {
            const response = await axios.get(`https://restcountries.com/v3.1/alpha/${countryCode}`);
            if (response.data && response.data[0].flags) {
                return response.data[0].flags.png || response.data[0].flags.svg;
            }
            console.warn('Flag data not available');
            return '';
        } catch (error) {
            console.error('Failed to fetch country flag:', error);
            return '';
        }
    };

    useEffect(() => {
        if (weather) {
            const fetchFlag = async () => {
                const flag = await getCountryFlagURL(weather.city.country);
                setFlagURL(flag);
            };
            fetchFlag();
        }
    }, [weather]);

    const fetchLatLon = (cityName, countryCode) => new Promise((resolve, reject) => {
        axios.get(`https://api.openweathermap.org/geo/1.0/direct?q=${cityName},${countryCode}&limit=1&appid=${apiKey}`)
            .then((response) => {
                if (response.data && response.data.length > 0) {
                    const { lat, lon } = response.data[0];
                    resolve({ lat, lon });
                } else {
                    reject(new Error('Location not found'));
                }
            })
            .catch((error) => {
                reject(error);
            });
    });

    useEffect(() => {
        if (userData && userData.settings
            && userData.settings.defaultLocation && userData.settings.defaultCountry) {
            fetchLatLon(userData.settings.defaultLocation, userData.settings.defaultCountry)
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

    const kelvinToCelsius = (kelvin) => kelvin - 273.15;

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

    const getDayOfWeek = (date) => {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return days[date.getDay()];
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

    const groupForecastsByDay = (list) => list.reduce((acc, forecast) => {
        const day = getDayOfWeek(new Date(forecast.dt * 1000));
        if (!acc[day]) acc[day] = [];
        acc[day].push(forecast);
        return acc;
    }, {});

    const getLocalTime = (utcSeconds) => {
        const d = new Date(0);
        d.setUTCSeconds(utcSeconds + timezoneOffset);
        return d;
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
                    console.error(
                        'Error fetching weather data: ',
                        error.response
                            ? error.response.data
                            : error,
                    );
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
                        let dayGroupClass = 'day-group';
                        if (isHeroDay || isExpandedDay) {
                            dayGroupClass += ' hero-day-group';
                        }

                        let wrapperClass = 'day-container-wrapper';
                        if (isHeroDay || isExpandedDay) {
                            wrapperClass += ' hero-day-container-wrapper';
                        }

                        const dayGroup = groupedByDay[day].filter((forecast) => {
                            const forecastDate = new Date(forecast.dt * 1000);
                            const hour = forecastDate.getUTCHours();
                            return (isHeroDay || isExpandedDay) ? true : (hour >= 11 && hour <= 13);
                        });
                        if (dayGroup.length === 0) {
                            return null;
                        }
                        if (!isHeroDay) {
                            dayGroupClass += ' clickable';
                        }
                        const currentDate = new Date(dayGroup[0].dt * 1000);
                        return (
                            <div
                                className={dayGroupClass}
                                key={day}
                                onClick={() => { if (!isHeroDay) toggleExpandedDay(day); }}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => { if (e.key === 'Enter' && !isHeroDay) toggleExpandedDay(day); }}
                            >
                                <div className="day-title">
                                    {day}
                                    {' '}
                                    (
                                    {currentDate.toLocaleDateString()}
                                    )
                                </div>
                                <div className={wrapperClass}>
                                    {dayGroup.map((forecast, forecastIndex) => {
                                        const isCurrentDay = isHeroDay && forecastIndex === 0;
                                        let containerClass = isCurrentDay ? ' current-day' : ' non-current-day';
                                        if (isExpandedDay) {
                                            containerClass = ' current-day';
                                        }
                                        const forecastDate = getLocalTime(forecast.dt);
                                        const timeString = forecastDate.toLocaleTimeString();
                                        const weatherIconUrl = `https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`;
                                        return (
                                            <div className={`day-container${containerClass}`} key={forecast.dt}>
                                                <div className="time">
                                                    {timeString}
                                                    <img
                                                        src={weatherIconUrl}
                                                        alt={forecast.weather[0].description}
                                                    />
                                                </div>
                                                <div>
                                                    <strong>Temperature:</strong>
                                                    {' '}
                                                    {kelvinToCelsius(forecast.main.temp).toFixed(2)}
                                                    {' '}
                                                    &#8451;
                                                </div>
                                                <div>
                                                    <strong>Description:</strong>
                                                    {' '}
                                                    {forecast.weather[0].description}
                                                </div>
                                                <div>
                                                    <strong>Wind Speed:</strong>
                                                    {' '}
                                                    {forecast.wind.speed}
                                                    {' '}
                                                    m/s
                                                </div>
                                                <div>
                                                    <strong>Humidity:</strong>
                                                    {' '}
                                                    {forecast.main.humidity}
                                                    %
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
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
