import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import '../styles/searchbar.scss';

function SearchBar({
    onSearch, countries, clearCountries, setSelectedCity, variant,
}) {
    const [search, setSearch] = useState('');

    const debounce = (func, delay) => {
        let debounceTimer;
        return function debouncedFunction(...args) {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => func.apply(this, args), delay);
        };
    };

    useEffect(() => {
        const debouncedSearch = debounce(() => {
            if (search.length > 2) {
                onSearch(search);
            }
        }, 300);
        debouncedSearch();
    }, [search]);

    const handleSearch = (event) => {
        const searchTerm = event.target.value;
        setSearch(searchTerm);
        if (searchTerm.length > 2) {
            onSearch(searchTerm);
        }
    };

    const handleClick = (country) => {
        setSelectedCity({ lat: country.lat, lon: country.lon });
        setSearch('');
        clearCountries();
    };

    return (
        <div className={`searchbar-container ${variant}`}>
            <input
                type="text"
                value={search}
                onChange={handleSearch}
                placeholder="Search for a country or city"
            />
            {countries && (
                <div className="search-results">
                    {countries.map((country) => (
                        <div
                            key={`${country.lat},${country.lon}`}
                            role="button"
                            tabIndex={0}
                            onClick={() => handleClick(country)}
                            onKeyPress={() => handleClick(country)}
                        >
                            {`${country.name}, ${country.country}${country.state ? `, ${country.state}` : ''}`}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

SearchBar.defaultProps = {
    variant: '',
};

SearchBar.propTypes = {
    onSearch: PropTypes.func.isRequired,
    countries: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            lat: PropTypes.number.isRequired,
            lon: PropTypes.number.isRequired,
        }),
    ).isRequired,
    clearCountries: PropTypes.func.isRequired,
    setSelectedCity: PropTypes.func.isRequired,
    variant: PropTypes.string,
};

export default SearchBar;
