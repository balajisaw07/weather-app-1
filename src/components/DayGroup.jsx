import React from 'react';
import PropTypes from 'prop-types';
import { kelvinToCelsius, getLocalTime } from './helpers/helpers';

function DayGroup({
    day,
    index,
    dayGroup,
    expandedDay,
    toggleExpandedDay,
    timezoneOffset,
}) {
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

    const currentDate = new Date(dayGroup[0].dt * 1000);

    return (
        <div
            className={dayGroupClass}
            onClick={() => { if (!isHeroDay) toggleExpandedDay(day); }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' && !isHeroDay) toggleExpandedDay(day); }}
        >
            <div className="day-title">
                {day}
                {' '}
                (
                {currentDate.toLocaleDateString('en-GB')}
                )
            </div>
            <div className={wrapperClass}>
                {dayGroup.map((forecast, forecastIndex) => {
                    const isCurrentDay = isHeroDay && forecastIndex === 0;
                    let containerClass = isCurrentDay ? ' current-day' : ' non-current-day';
                    if (isExpandedDay) {
                        containerClass = ' current-day';
                    }
                    const forecastDate = getLocalTime(forecast.dt, timezoneOffset);
                    const timeString = forecastDate.toLocaleTimeString();
                    const weatherIconUrl = `https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`;
                    return (
                        <div className={`day-container${containerClass}`} key={forecast.dt}>
                            <div className="time">
                                {timeString}
                                <img src={weatherIconUrl} alt={forecast.weather[0].description} />
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
}

DayGroup.propTypes = {
    day: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    dayGroup: PropTypes.arrayOf(
        PropTypes.shape({
            dt: PropTypes.number,
            main: PropTypes.shape({
                temp: PropTypes.number,
                humidity: PropTypes.number,
            }),
            weather: PropTypes.arrayOf(
                PropTypes.shape({
                    icon: PropTypes.string,
                    description: PropTypes.string,
                }),
            ),
            wind: PropTypes.shape({
                speed: PropTypes.number,
            }),
        }),
    ).isRequired,
    expandedDay: PropTypes.string,
    toggleExpandedDay: PropTypes.func.isRequired,
    timezoneOffset: PropTypes.number.isRequired,
};

DayGroup.defaultProps = {
    expandedDay: null,
};

export default DayGroup;
