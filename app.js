require('dotenv').config();
const express = require('express');
const http = require('http');
const { webAppPort } = require('./config');
const { connectDB } = require('./db/connectDb');
const { WebSocketServer } = require('ws');
const { gameWebSocket } = require('./sockets/gameWebSocket');

const app = express();
app.use(express.json());

app.use('/', require('./routes'));

const server = http.createServer(app);
const wss = new WebSocketServer({ server });
gameWebSocket(wss);

(async () => {
    await connectDB();

    server.listen(webAppPort, () => {
        console.log(`Server listening on port ${webAppPort}`);
    });
})();

module.exports = app;
