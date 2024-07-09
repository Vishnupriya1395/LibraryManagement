import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const UserDashboard = () => {
    const [books, setBooks] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        axios.get('http://localhost:5000/api/books', { headers: { Authorization: `Bearer ${token}` } })
            .then(response => setBooks(response.data))
            .catch(error => console.error('There was an error fetching the books!', error));
        
        axios.get('http://localhost:5000/api/transactions/user', { headers: { Authorization: `Bearer ${token}` } })
            .then(response => setTransactions(response.data))
            .catch(error => console.error('There was an error fetching the transactions!', error));
    }, [navigate]);

    return (
        <div>
            <h1>User Dashboard</h1>
            <Link to="/logout">Log Out</Link>
            <div>
                <h2>Library Catalog</h2>
                <ul>
                    {books.map(book => (
                        <li key={book._id}>{book.name} by {book.author}</li>
                    ))}
                </ul>
            </div>
            <div>
                <h2>Personal Transaction History</h2>
                <ul>
                    {transactions.map(transaction => (
                        <li key={transaction._id}>
                            {transaction.book.name} - {transaction.type} on {new Date(transaction.date).toLocaleDateString()}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default UserDashboard;
