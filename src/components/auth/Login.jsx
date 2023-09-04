import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/login.scss';
import ErrorModal from '../ErrorModal';

function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { username, password } = formData;

    const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const user = {
            username,
            password,
        };

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            };

            const body = JSON.stringify(user);
            const res = await axios.post(
                `${process.env.REACT_APP_API_URL}/user/login`,
                body,
                config,
            );

            localStorage.setItem('token', res.data.token);
            navigate('/dashboard', { replace: true });
        } catch (err) {
            setError(err.response.data.message);
        } finally {
            setLoading(false);
        }
    };

    const clearError = () => {
        setError('');
    };

    return (
        <div className="login-container">
            <h1>Login</h1>
            {error && <ErrorModal message={error} onClose={clearError} />}
            <form onSubmit={(e) => onSubmit(e)}>
                <div>
                    <input
                        type="text"
                        placeholder="Username"
                        name="username"
                        value={username}
                        onChange={(e) => onChange(e)}
                        required
                    />
                </div>
                <div>
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        value={password}
                        onChange={(e) => onChange(e)}
                        required
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </div>
    );
}

export default Login;
