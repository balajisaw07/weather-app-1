export const kelvinToCelsius = (kelvin) => kelvin - 273.15;

export const getDayOfWeek = (date) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date.getDay()];
};

export const getLocalTime = (utcSeconds, timezoneOffset) => {
    const d = new Date(0);
    d.setUTCSeconds(utcSeconds + timezoneOffset);
    return d;
};
