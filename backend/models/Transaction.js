// models/Transaction.js
const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
    dueDate: Date,
    type: String // 'borrowed' or 'returned'
});

module.exports = mongoose.model('Transaction', TransactionSchema);
