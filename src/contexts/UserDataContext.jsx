import React, {
    useContext, useMemo, useEffect, useState,
} from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

export const UserDataContext = React.createContext();

export function UserDataProvider({ children }) {
    const [userData, setUserData] = useState(null);

    const fetchUserData = async () => {
        const backendUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000';
        try {
            const res = await axios.get(`${backendUrl}/user/dashboard`, {
                headers: {
                    'x-auth-token': localStorage.getItem('token'),
                },
            });
            setUserData(res.data.user);
        } catch (err) {
            console.error(err.response.data);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    const contextValue = useMemo(() => ({
        userData,
        setUserData,
        fetchUserData,
    }), [userData]);

    return (
        <UserDataContext.Provider value={contextValue}>
            {children}
        </UserDataContext.Provider>
    );
}

UserDataProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const useUserData = () => {
    const context = useContext(UserDataContext);
    if (!context) {
        throw new Error('useUserData must be used within a UserDataProvider');
    }
    return context;
};
