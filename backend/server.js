const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/library', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to the database');
});

const bookRoutes = require('./routes/books');
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth'); // This is for auth routes
const transactionRoutes = require('./routes/transactions');
const { auth, admin } = require('./middleware/auth'); // This is for middleware functions

app.use('/api/books', auth, bookRoutes);
app.use('/api/users', auth, userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/transactions', auth, transactionRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
