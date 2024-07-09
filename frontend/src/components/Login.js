import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const [isRegister, setIsRegister] = useState(false);
    const [isAdminLogin, setIsAdminLogin] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();
        setError('');
        if (isAdminLogin) {
            if (username === 'Admin' && password === 'Welcome@123') {
                localStorage.setItem('role', 'admin');
                localStorage.setItem('token', 'adminToken'); // Simulate a token
                navigate('/admin');
            } else {
                setError('Invalid admin credentials');
            }
        } else {
            try {
                const response = await axios.post('http://localhost:5000/api/auth/login', { username, password });
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('role', response.data.role);
                if (response.data.role === 'admin') {
                    navigate('/admin');
                } else {
                    navigate('/user');
                }
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    setError('Username not available');
                } else if (error.response && error.response.status === 400) {
                    setError('Incorrect password');
                } else {
                    setError('Login failed');
                }
            }
        }
    };

    const handleRegister = async (event) => {
        event.preventDefault();
        setError('');
        try {
            const response = await axios.post('http://localhost:5000/api/auth/register', {
                username,
                password,
                name,
                email,
                contactNumber,
                role: 'user'
            });
            alert('Registration successful, please log in.');
            setIsRegister(false);
        } catch (error) {
            setError('Registration failed');
        }
    };

    return (
        <div>
            <h2>{isRegister ? 'Register' : isAdminLogin ? 'Admin Login' : 'Login'}</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={isRegister ? handleRegister : handleLogin}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                {isRegister && (
                    <>
                        <input
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Contact Number"
                            value={contactNumber}
                            onChange={(e) => setContactNumber(e.target.value)}
                            required
                        />
                    </>
                )}
                <button type="submit">{isRegister ? 'Register' : 'Login'}</button>
            </form>
            <button onClick={() => setIsRegister(!isRegister)}>
                {isRegister ? 'Already have an account? Login' : "Don't have an account? Register"}
            </button>
            {!isRegister && (
                <button onClick={() => setIsAdminLogin(!isAdminLogin)}>
                    {isAdminLogin ? 'Regular User Login' : 'Admin Login'}
                </button>
            )}
        </div>
    );
};

export default Login;
