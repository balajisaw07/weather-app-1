import React, { useState } from 'react';
import axios from 'axios';
import '../../styles/register.scss';
import { useNavigate } from 'react-router-dom';
import ErrorModal from '../ErrorModal';

function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
    });
    const [message, setMessage] = useState('');

    const { username, password, email } = formData;

    const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        const newUser = {
            username,
            password,
            email,
        };
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            };
            const body = JSON.stringify(newUser);
            await axios.post(
                `${process.env.REACT_APP_API_URL}/user/register`,
                body,
                config,
            );
            setMessage('Account successfully created');
            setTimeout(() => {
                navigate('/login');
                setMessage('');
            }, 4000);
        } catch (err) {
            setMessage(err.response.data.message);
        }
    };

    const clearMessage = () => {
        setMessage('');
    };

    return (
        <div className="register-container">
            <h1>Register</h1>
            {message && <ErrorModal message={message} onClose={clearMessage} />}
            <form onSubmit={(e) => onSubmit(e)}>
                <div>
                    <input
                        type="text"
                        placeholder="Username (3-16 alphanumeric characters)"
                        name="username"
                        minLength="3"
                        maxLength="16"
                        pattern="[a-zA-Z0-9]+"
                        value={username}
                        onChange={(e) => onChange(e)}
                        required
                    />
                </div>
                <div>
                    <input
                        type="password"
                        placeholder="Password (Min. 8 characters, 1 number)"
                        name="password"
                        minLength="8"
                        pattern="(?=.*\d).+"
                        value={password}
                        onChange={(e) => onChange(e)}
                        required
                    />
                </div>
                <div>
                    <input
                        type="email"
                        placeholder="Email"
                        name="email"
                        pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                        value={email}
                        onChange={(e) => onChange(e)}
                        required
                    />
                </div>
                <input type="submit" value="Register" />
            </form>
        </div>
    );
}

export default Register;
