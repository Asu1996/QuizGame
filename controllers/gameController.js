const GameSession = require('../db/models/GameSession');
const Question = require('../db/models/Question');

const startGameController = async (req, res) => {
    const {
        user: { userId },
    } = req;

    try {
        let session = await GameSession.findOne({
            status: 'waiting',
        });

        if (!session) {
            session = await GameSession.create({
                players: [userId],
                status: 'waiting',
            });
            return res.json({
                message: 'Session created. Waiting for another player',
                sessionId: session._id,
            });
        } else {
            if (session.players.includes(userId)) {
                return res.json({
                    message:
                        'Session already created. Waiting for another player',
                    sessionId: session._id,
                });
            }

            const updatedSession = {
                players: [...(session.players || []), userId],
                status: 'in-progress',
            };

            const questions = await Question.aggregate([
                { $sample: { size: 4 } },
            ]);
            updatedSession.questions = questions.map((q) => q._id);
            await GameSession.updateOne(
                { _id: session._id },
                { $set: updatedSession }
            );

            // TODO: emit game:init event for both userId

            return res.json({
                message: 'Game started',
                sessionId: session._id,
            });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Cannot start game', error });
    }
};

module.exports = { startGameController };
