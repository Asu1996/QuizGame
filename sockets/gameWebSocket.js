const { sendQuestion } = require('./helpers/sendQuestion');
const { submitAnswer } = require('./helpers/submitAnswer');

const playerConnections = new Map();
const playerQuestionTrack = new Map();

const gameWebSocket = (wss) => {
    wss.on('connection', (ws) => {
        ws.on('message', async (message) => {
            const data = JSON.parse(message);

            if (data.event === 'game:init') {
                playerConnections.set(data.playerId, ws);

                if (!playerQuestionTrack.has(data.playerId)) {
                    playerQuestionTrack.set(data.playerId, 0);
                }
            }

            if (data.event === 'question:send') {
                await sendQuestion(data, ws, playerQuestionTrack);
            }

            if (data.event === 'answer:submit') {
                await submitAnswer(data, ws, playerConnections, playerQuestionTrack);
            }
        });
    });
};

module.exports = { gameWebSocket };
