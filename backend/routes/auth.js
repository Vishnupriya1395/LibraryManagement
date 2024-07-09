const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Admin = require('../models/Admin');

// Registration route
router.post('/register', async (req, res) => {
    try {
        const { username, name, email, contactNumber, password, role } = req.body;

        const existingUser = await User.findOne({ username }) || await Admin.findOne({ username });
        if (existingUser) return res.status(400).json({ message: 'Username already exists' });

        if (role === 'admin') {
            const newAdmin = new Admin({ username, name, email, contactNumber, password });
            await newAdmin.save();
            res.status(201).json(newAdmin);
        } else {
            const newUser = new User({ username, name, email, contactNumber, password });
            await newUser.save();
            res.status(201).json(newUser);
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Login route
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username }) || await Admin.findOne({ username });

        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id, role: user.role }, 'your_jwt_secret', { expiresIn: '1h' });
        res.json({ token, role: user.role });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
