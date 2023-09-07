import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/weather.scss';
import SearchBar from './SearchBar';

function Weather() {
    const apiKey = process.env.REACT_APP_API_KEY;
    const [weather, setWeather] = useState(null);
    const [countries, setCountries] = useState([]);
    const [selectedCity, setSelectedCity] = useState({ lat: 40.7128, lon: -74.0060 });

    useEffect(() => {
        setSelectedCity({ lat: 40.7128, lon: -74.0060 });
    }, []);

    const kelvinToCelsius = (kelvin) => kelvin - 273.15;

    const getDayOfWeek = (date) => {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return days[date.getDay()];
    };

    const handleSearch = (searchTerm) => {
        if (searchTerm.length > 2) {
            fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${searchTerm}&limit=5&appid=${apiKey}`)
                .then((response) => response.json())
                .then((data) => {
                    console.log(data);
                    setCountries(data);
                })
                .catch((error) => console.error(error));
        } else {
            setCountries([]);
        }
    };

    const handleCityClick = (city) => {
        setSelectedCity({ lat: city.lat, lon: city.lon });
        setCountries([]);
    };

    const groupForecastsByDay = (list) => list.reduce((acc, forecast) => {
        const day = getDayOfWeek(new Date(forecast.dt * 1000));
        if (!acc[day]) acc[day] = [];
        acc[day].push(forecast);
        return acc;
    }, {});

    useEffect(() => {
        if (selectedCity) {
            axios
                .get(`https://api.openweathermap.org/data/2.5/forecast?lat=${selectedCity.lat}&lon=${selectedCity.lon}&appid=${apiKey}`)
                .then((response) => {
                    setWeather(response.data);
                })
                .catch((error) => {
                    console.error('Error fetching weather data: ', error.response ? error.response.data : error);
                });
        }
    }, [selectedCity, apiKey]);

    const groupedByDay = weather ? groupForecastsByDay(weather.list) : null;

    return (
        <div className="weather-container">
            <SearchBar onSearch={handleSearch} countries={countries} />
            <div className="country-list">
                {countries.map((country) => (
                    <div
                        key={`${country.lat},${country.lon}`}
                        role="button"
                        tabIndex={0}
                        onClick={() => handleCityClick(country)}
                        onKeyPress={() => handleCityClick(country)}
                    >
                        {`${country.name}, ${country.country}${country.state ? `, ${country.state}` : ''}`}
                    </div>
                ))}
            </div>
            {weather ? (
                <div className="weather-card">
                    <h2>
                        Weather Forecast in
                        {' '}
                        {weather.city.name}
                    </h2>
                    {Object.keys(groupedByDay).map((day, index) => (
                        <div className={index === 0 ? 'hero-day-group' : 'day-group'} key={day}>
                            <div className="day-title">
                                {day}
                                {' '}
                                (
                                {new Date(groupedByDay[day][0].dt * 1000).toLocaleDateString()}
                                )
                            </div>
                            <div className={index === 0 ? 'hero-day-container-wrapper' : ''}>
                                {groupedByDay[day].map((forecast, forecastIndex) => {
                                    if (index !== 0 && forecastIndex !== 0) {
                                        return null;
                                    }
                                    const isCurrentDay = index === 0 && forecastIndex === 0;
                                    return (
                                        <div className={`day-container${isCurrentDay ? ' current-day' : ''}`} key={forecast.dt}>
                                            <div className="time">{new Date(forecast.dt * 1000).toLocaleTimeString()}</div>
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
                    ))}
                </div>
            ) : (
                <div className="loading">Loading...</div>
            )}
        </div>
    );
}

export default Weather;
