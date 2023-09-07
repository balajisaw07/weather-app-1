import React from 'react';
import PropTypes from 'prop-types';

function CountryList({ countries, onSelect }) {
    return (
        <ul>
            {countries.map((country) => (
                <li key={country}>
                    <button
                        type="button"
                        onClick={() => onSelect(country)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') onSelect(country);
                        }}
                    >
                        {country}
                    </button>
                </li>
            ))}
        </ul>
    );
}

CountryList.propTypes = {
    countries: PropTypes.arrayOf(PropTypes.string).isRequired,
    onSelect: PropTypes.func.isRequired,
};

export default CountryList;
