import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AppRouter from './AppRouter';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import './styles/global.scss';
import { UserDataProvider } from './contexts/UserDataContext';

function App() {
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
        const token = localStorage.getItem('token');
        if (token) {
            fetchUserData();
        }
    }, []);

    useEffect(() => {
    }, [userData]);

    return (
        <UserDataProvider
            fetchUserData={fetchUserData}
            userData={userData}
            setUserData={setUserData}
        >
            <div className="App" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <div style={{ flex: '1' }}>
                    <AppRouter>
                        <Navigation userData={userData} />
                    </AppRouter>
                </div>
                <Footer />
            </div>
        </UserDataProvider>
    );
}

export default App;
