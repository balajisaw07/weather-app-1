import React, { useContext, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';

export const UserDataContext = React.createContext();

export function UserDataProvider({
    children, fetchUserData, userData, setUserData,
}) {
    const contextValue = useMemo(() => ({
        userData,
        setUserData,
        fetchUserData,
    }), [userData, setUserData, fetchUserData]);

    useEffect(() => {
        console.log('UserDataContext updated:', userData);
    }, [userData]);

    return (
        <UserDataContext.Provider value={contextValue}>
            {children}
        </UserDataContext.Provider>
    );
}

UserDataProvider.propTypes = {
    children: PropTypes.node.isRequired,
    fetchUserData: PropTypes.func.isRequired,
    userData: PropTypes.shape({
        id: PropTypes.string,
        username: PropTypes.string,
        email: PropTypes.string,
        settings: PropTypes.shape({
            defaultCountry: PropTypes.string,
            defaultLocation: PropTypes.string,
            temperatureUnit: PropTypes.string,
        }),
    }),
    setUserData: PropTypes.func.isRequired,
};

UserDataProvider.defaultProps = {
    userData: null,
};

export const useUserData = () => {
    const context = useContext(UserDataContext);
    if (!context) {
        throw new Error('useUserData must be used within a UserDataProvider');
    }
    return context;
};
