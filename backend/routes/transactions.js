const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const Book = require('../models/Book');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
    try {
        const transactions = await Transaction.find().populate('book user');
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/', auth, async (req, res) => {
    const { username, bookId, type } = req.body;

    try {
        const user = await User.findOne({ username });
        const book = await Book.findById(bookId);
        if (!user || !book) {
            return res.status(400).json({ message: 'Invalid user or book ID' });
        }

        if (type === 'borrowed') {
            if (!book.availability) {
                return res.status(400).json({ message: 'Book is not available' });
            }
            book.availability = false;
            book.issuedTo = username;
        } else if (type === 'returned') {
            book.availability = true;
            book.issuedTo = null;
        }

        await book.save();

        const transaction = new Transaction({ user: user._id, book: book._id, type, date: new Date() });
        await transaction.save();
        res.status(201).json(transaction);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
