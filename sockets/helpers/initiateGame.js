const GameSession = require('../../db/models/GameSession');

/**
 * @param {any} data
 * @param {WebSocket} ws
 * @param {Map<string, WebSocket>} playerConnections
 * @param {Map<string, number>} playerQuestionTrack
 */
const initiateGame = async (
    data,
    ws,
    playerConnections,
    playerQuestionTrack
) => {
    const session = await GameSession.findOne({
        players: data.playerId,
        status: { $ne: 'completed' },
    });
    if (!session) {
        ws.send(
            JSON.stringify({
                event: 'game:init',
                status: 'Session not found. please re-start',
            })
        );
        return;
    }
    if (session.status === 'waiting') {
        ws.send(
            JSON.stringify({
                event: 'game:init',
                status: 'Waiting for another player. Please wait',
            })
        );
        return;
    }
    playerConnections.set(data.playerId, ws);

    if (!playerQuestionTrack.has(data.playerId)) {
        playerQuestionTrack.set(data.playerId, 0);
    }
    ws.send(
        JSON.stringify({
            event: 'game:init',
            sessionId: session._id,
        })
    );
};

module.exports = { initiateGame };
