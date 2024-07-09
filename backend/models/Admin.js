const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const AdminSchema = new mongoose.Schema({
    username: { type: String, unique: true },
    name: String,
    email: String,
    contactNumber: String,
    password: String,
    role: { type: String, default: 'admin' }
});

AdminSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

module.exports = mongoose.model('Admin', AdminSchema);
