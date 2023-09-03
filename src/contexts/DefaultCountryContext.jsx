import React, {
    createContext, useState, useContext, useMemo,
} from 'react';
import PropTypes from 'prop-types';

// Create a context
const DefaultCountryContext = createContext();

// Create a provider component
export function DefaultCountryProvider({ children }) {
    const [defaultCountry, setDefaultCountry] = useState('United States');

    const value = useMemo(() => ({ defaultCountry, setDefaultCountry }), [defaultCountry]);

    return (
        <DefaultCountryContext.Provider value={value}>
            {children}
        </DefaultCountryContext.Provider>
    );
}

DefaultCountryProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const useDefaultCountry = () => {
    const context = useContext(DefaultCountryContext);
    if (!context) {
        throw new Error('useDefaultCountry must be used within a DefaultCountryProvider');
    }
    return context;
};
