import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/weather.scss';
import PropTypes from 'prop-types';

function Weather({ cityId }) {
    const apiKey = process.env.REACT_APP_API_KEY;
    const [weather, setWeather] = useState(null);

    const kelvinToCelsius = (kelvin) => kelvin - 273.15;

    const getDayOfWeek = (date) => {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return days[date.getDay()];
    };

    const groupForecastsByDay = (list) => list.reduce((acc, forecast) => {
        const day = getDayOfWeek(new Date(forecast.dt * 1000));
        if (!acc[day]) acc[day] = [];
        acc[day].push(forecast);
        return acc;
    }, {});

    useEffect(() => {
        axios
            .get(`https://api.openweathermap.org/data/2.5/forecast?id=${cityId}&appid=${apiKey}`)
            .then((response) => {
                setWeather(response.data);
            })
            .catch((error) => {
                console.error('Error fetching weather data: ', error);
            });
    }, [cityId, apiKey]);

    const groupedByDay = weather ? groupForecastsByDay(weather.list) : null;

    return (
        <div className="weather-container">
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
                                    return (
                                        <div className={`day-container${index === 0 ? ' current-day' : ''}`} key={forecast.dt}>
                                            {index === 0 && (
                                                <div className="time">{new Date(forecast.dt * 1000).toLocaleTimeString()}</div>
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
                    ))}
                </div>
            ) : (
                <div className="loading">Loading...</div>
            )}
        </div>
    );
}

Weather.propTypes = {
    cityId: PropTypes.string.isRequired,
};

export default Weather;
