const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    availability: {
        type: Boolean,
        default: true
    },
    issuedTo: {
        type: String,
        default: null
    }
});

module.exports = mongoose.model('Book', bookSchema);
