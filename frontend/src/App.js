import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';
import Login from './components/Login';
import Logout from './components/Logout';
import './App.css';

function App() {
    const isAuthenticated = !!localStorage.getItem('token');
    const role = localStorage.getItem('role');

    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/admin" element={isAuthenticated && role === 'admin' ? <AdminDashboard /> : <Navigate to="/" />} />
                    <Route path="/user" element={isAuthenticated ? <UserDashboard /> : <Navigate to="/" />} />
                    <Route path="/logout" element={<Logout />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
