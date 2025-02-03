const { WebSocket } = require('ws');
const GameSession = require('../../db/models/GameSession');

/**
 *
 * @param {any} data
 * @param {WebSocket} ws
 * @param {Map<string, number>} playerQuestionTrack
 */
const sendQuestion = async (data, ws, playerQuestionTrack) => {
    const session = await GameSession.findById(data.sessionId).populate(
        'questions'
    );

    const currentQuestionIndexForPlayer = playerQuestionTrack.get(
        data.playerId
    );
    if (currentQuestionIndexForPlayer < session.questions.length) {
        const question = session.questions[currentQuestionIndexForPlayer];

        ws.send(
            JSON.stringify({
                event: 'question:send',
                question: {
                    id: question._id,
                    text: question.text,
                    options: question.options,
                },
            })
        );
    } else {
        ws.send(
            JSON.stringify({
                event: 'game:end',
                message: 'All questions have been answered!',
            })
        );
    }
};

module.exports = { sendQuestion };
