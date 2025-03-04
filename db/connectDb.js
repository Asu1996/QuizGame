const mongoose = require('mongoose');
const { mongoUri } = require('../config');

const connectDB = async () => {
    try {
        await mongoose.connect(mongoUri);
        console.log('MongoDB connected');
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
    }
};

const getConnection = () => {
    return mongoose.connection.getClient();
};

module.exports = { connectDB, getConnection };
