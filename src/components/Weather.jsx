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

    useEffect(() => {
        axios
            .get(`http://api.openweathermap.org/data/2.5/forecast?id=${cityId}&appid=${apiKey}`)
            .then((response) => {
                setWeather(response.data);
            })
            .catch((error) => {
                console.error('Error fetching weather data: ', error);
            });
    }, [cityId, apiKey]);

    return (
        <div className="weather-container">
            {weather ? (
                <div className="weather-card">
                    <h2>
                        Weather Forecast in
                        {' '}
                        {weather.city.name}
                    </h2>
                    <div className="forecast-grid">
                        {weather.list.map((forecast) => (
                            <div className="day-container" key={forecast.dt}>
                                <h3>{getDayOfWeek(new Date(forecast.dt * 1000))}</h3>
                                <div className="time">{new Date(forecast.dt * 1000).toLocaleTimeString()}</div>
                                <div>
                                    Temperature:
                                    {' '}
                                    {kelvinToCelsius(forecast.main.temp).toFixed(2)}
                                    {' '}
                                    &#8451;
                                </div>
                                <div>
                                    Description:
                                    {' '}
                                    {forecast.weather[0].description}
                                </div>
                                <div>
                                    Wind Speed:
                                    {' '}
                                    {forecast.wind.speed}
                                    {' '}
                                    m/s
                                </div>
                                <div>
                                    Humidity:
                                    {' '}
                                    {forecast.main.humidity}
                                    %
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div>Loading...</div>
            )}
        </div>
    );
}

Weather.propTypes = {
    cityId: PropTypes.string.isRequired,
};

export default Weather;
