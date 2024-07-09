import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Clear the authentication tokens
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        // Redirect to login page
        navigate('/');
    }, [navigate]);

    return null;
};

export default Logout;
