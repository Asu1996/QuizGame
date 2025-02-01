require('dotenv').config();
const express = require('express');
const { webAppPort } = require('./config');
const { connectDB } = require('./db/connectDb');

const app = express();
app.use(express.json());

// TODO: start app only after db connected
connectDB();

app.listen(webAppPort, () => {
    console.log(`Server listening on port ${webAppPort}`);
});

app.use('/', require('./routes'));

module.exports = app;
