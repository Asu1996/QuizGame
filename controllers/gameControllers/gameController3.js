const mongoose = require('mongoose');
const { getConnection } = require('../../db/connectDb');
const GameSession = require('../../db/models/GameSession');
const Question = require('../../db/models/Question');

const startGameController = async (req, res) => {
    const {
        user: { userId },
    } = req;

    const session = getConnection().startSession();

    try {
        const result = await session.withTransaction(async () => {
            let gameSession = await GameSession.findOne(
                { status: 'waiting' },
                null,
                { session }
            );

            if (!gameSession) {
                gameSession = await GameSession.create(
                    [{ players: [userId], status: 'waiting' }],
                    { session }
                );

                return {
                    message: 'Session created. Waiting for another player',
                    sessionId: gameSession[0]._id,
                };
            }

            if (gameSession.players.includes(userId)) {
                return {
                    message:
                        'Session already created. Waiting for another player',
                    sessionId: gameSession._id,
                };
            }

            gameSession.players.push(userId);
            gameSession.status = 'in-progress';

            const questions = await Question.aggregate(
                [{ $sample: { size: 4 } }],
                { session }
            );
            gameSession.questions = questions.map((q) => q._id);

            await gameSession.save({ session });

            return {
                message: 'Game started',
                sessionId: gameSession._id,
            };
        });

        return res.json(result);
    } catch (error) {
        return res.status(400).json({
            message: 'Error starting game',
            error: error.message,
        });
    } finally {
        session.endSession();
    }
};

module.exports = { startGameController };
