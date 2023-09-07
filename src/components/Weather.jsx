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

    const clearCountries = () => {
        setCountries([]);
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
                    console.error(
                        'Error fetching weather data: ',
                        error.response
                            ? error.response.data
                            : error,
                    );
                });
        }
    }, [selectedCity, apiKey]);

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
                    </h2>
                    {Object.keys(groupedByDay).map((day, index) => {
                        const isHeroDay = index === 0;
                        const dayGroup = groupedByDay[day].filter((forecast) => {
                            const forecastDate = new Date(forecast.dt * 1000);
                            const hour = forecastDate.getUTCHours();
                            return (!isHeroDay) ? (hour >= 11 && hour <= 13) : true;
                        });
                        if (dayGroup.length === 0) {
                            return null;
                        }
                        const currentDate = new Date(dayGroup[0].dt * 1000);
                        return (
                            <div className={`day-group${isHeroDay ? ' hero-day-group' : ''}`} key={day}>
                                <div className="day-title">
                                    {day}
                                    {' '}
                                    (
                                    {currentDate.toLocaleDateString()}
                                    )
                                </div>
                                <div className={isHeroDay ? 'hero-day-container-wrapper' : ''}>
                                    {dayGroup.map((forecast, forecastIndex) => {
                                        const isCurrentDay = isHeroDay && forecastIndex === 0;
                                        const forecastDate = new Date(forecast.dt * 1000);
                                        const timeString = forecastDate.toLocaleTimeString();
                                        return (
                                            <div className={`day-container${isCurrentDay ? ' current-day' : ''}`} key={forecast.dt}>
                                                {isHeroDay && (
                                                    <div className="time">
                                                        {timeString}
                                                    </div>
                                                )}
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

export default Weather;
