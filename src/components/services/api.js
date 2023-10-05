import axios from 'axios';
import { getDayOfWeek } from '../helpers/helpers';

export const getCountryFlagURL = async (countryCode) => {
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

export const fetchLatLon = (cityName, countryCode, apiKey) => new Promise((resolve, reject) => {
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

export const groupForecastsByDay = (list) => list.reduce((acc, forecast) => {
    const day = getDayOfWeek(new Date(forecast.dt * 1000));
    if (!acc[day]) acc[day] = [];
    acc[day].push(forecast);
    return acc;
}, {});
