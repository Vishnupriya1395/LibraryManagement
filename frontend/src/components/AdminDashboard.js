import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const AdminDashboard = () => {
    const [books, setBooks] = useState([]);
    const [newBook, setNewBook] = useState({ name: '', author: '' });
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        fetchBooks(token);
    }, [navigate]);

    const fetchBooks = async (token) => {
        try {
            const response = await axios.get('http://localhost:5000/api/books', { headers: { Authorization: `Bearer ${token}` } });
            setBooks(response.data);
        } catch (error) {
            console.error('There was an error fetching the books!', error);
        }
    };

    const addBook = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.post('http://localhost:5000/api/books', newBook, { headers: { Authorization: `Bearer ${token}` } });
            setBooks([...books, response.data]);
            setNewBook({ name: '', author: '' }); // Clear the input fields
        } catch (error) {
            console.error('There was an error adding the book!', error);
        }
    };

    const deleteBook = async (id) => {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`http://localhost:5000/api/books/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            setBooks(books.filter(book => book._id !== id));
        } catch (error) {
            console.error('There was an error deleting the book!', error);
        }
    };

    const issueBook = async (book) => {
        const token = localStorage.getItem('token');
        const username = prompt('Enter username to issue this book to:');
        if (!username) return;
        try {
            await axios.post('http://localhost:5000/api/transactions', { username, bookId: book._id, type: 'borrowed' }, { headers: { Authorization: `Bearer ${token}` } });
            alert('Book issued successfully');
            fetchBooks(token);
        } catch (error) {
            console.error('There was an error issuing the book!', error);
        }
    };

    const returnBook = async (book) => {
        const token = localStorage.getItem('token');
        try {
            await axios.post('http://localhost:5000/api/transactions', { username: book.issuedTo, bookId: book._id, type: 'returned' }, { headers: { Authorization: `Bearer ${token}` } });
            alert('Book returned successfully');
            fetchBooks(token);
        } catch (error) {
            console.error('There was an error returning the book!', error);
        }
    };

    return (
        <div>
            <h1>Admin Dashboard</h1>
            <Link to="/logout">Log Out</Link>
            <div>
                <h2>Add Book</h2>
                <input
                    type="text"
                    placeholder="Book Name"
                    value={newBook.name}
                    onChange={e => setNewBook({ ...newBook, name: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Author"
                    value={newBook.author}
                    onChange={e => setNewBook({ ...newBook, author: e.target.value })}
                />
                <button onClick={addBook}>Add Book</button>
            </div>
            <div>
                <h2>Available Books</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Book ID</th>
                            <th>Book Name</th>
                            <th>Author</th>
                            <th>Status</th>
                            <th>Username</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {books.map(book => (
                            <tr key={book._id}>
                                <td>{book._id}</td>
                                <td>{book.name}</td>
                                <td>{book.author}</td>
                                <td>{book.availability ? 'Available' : 'Issued'}</td>
                                <td>{book.availability ? '' : book.issuedTo}</td>
                                <td>
                                    {book.availability ? (
                                        <button onClick={() => issueBook(book)}>Issue</button>
                                    ) : (
                                        <button onClick={() => returnBook(book)}>Return</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminDashboard;
