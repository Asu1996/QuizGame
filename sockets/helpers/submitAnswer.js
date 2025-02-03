const { WebSocket } = require('ws');
const GameSession = require('../../db/models/GameSession');
const Question = require('../../db/models/Question');

/**
 * @param {any} data
 * @param {WebSocket} ws
 * @param {Map<string, WebSocket>} playerConnections
 * @param {Map<string, number>} playerQuestionTrack
 */
const submitAnswer = async (
    data,
    ws,
    playerConnections,
    playerQuestionTrack
) => {
    const session = await GameSession.findById(data.sessionId);
    const question = await Question.findById(data.questionId);

    const sessionAnswers = session.answers;

    if (
        sessionAnswers.find(
            (a) =>
                a.player.toString() === data.playerId &&
                a.question.toString() === data.questionId
        )
    ) {
        ws.send(
            JSON.stringify({
                event: 'answer:submit',
                status: 'Already submitted',
            })
        );
        return;
    }

    const isCorrect = question.answer === data.answer;
    sessionAnswers.push({
        player: data.playerId,
        question: data.questionId,
        answer: data.answer,
        isCorrect,
    });
    await GameSession.updateOne(
        { _id: session._id },
        { $set: { answers: sessionAnswers } }
    );

    playerQuestionTrack.set(
        data.playerId,
        playerQuestionTrack.get(data.playerId) + 1
    );
    ws.send(
        JSON.stringify({
            event: 'answer:submit',
            status: isCorrect ? 'Correct' : 'Incorrect',
        })
    );

    if (session.answers.length >= 8) {
        const player1Score = session.answers.filter(
            (a) =>
                a.player.toString() === session.players[0].toString() &&
                a.isCorrect
        ).length;
        const player2Score = session.answers.filter(
            (a) =>
                a.player.toString() === session.players[1].toString() &&
                a.isCorrect
        ).length;
        const winner =
            player1Score === player2Score
                ? null
                : player1Score > player2Score
                ? session.players[0]
                : session.players[1];

        await GameSession.updateOne(
            { _id: session._id },
            {
                $set: {
                    finalScores: {
                        [session.players[0]]: player1Score,
                        [session.players[1]]: player2Score,
                    },
                    status: 'completed',
                    winner,
                },
            }
        );

        session.players.forEach((playerId) => {
            const playerSocket = playerConnections.get(playerId.toString());
            if (playerSocket && playerSocket.readyState === ws.OPEN) {
                playerSocket.send(
                    JSON.stringify({
                        event: 'game:end',
                        winner,
                        scores: {
                            [session.players[0]]: player1Score,
                            [session.players[1]]: player2Score,
                        },
                    })
                    // delete stored web socket?
                );
            }
        });
    }
};

module.exports = { submitAnswer };
