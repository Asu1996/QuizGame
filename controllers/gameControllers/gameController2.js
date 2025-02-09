const GameSession = require('../../db/models/GameSession');
const Question = require('../../db/models/Question');

const startGameController = async (req, res) => {
    const {
        user: { userId },
    } = req;

    try {
        let session = await GameSession.findOneAndUpdate( // findOneAndUpdate ensures atomic operation on db
            { status: 'waiting' },
            { $setOnInsert: { players: [userId], status: 'waiting' } },
            { upsert: true, new: true }
        );

        if (session.players.includes(userId)) {
            return res.json({
                message: 'Session already created. Waiting for another player',
                sessionId: session._id,
            });
        }

        // user1 should always return from the above check. user2 will come here in order to join the session
        if (session.players.length === 1) {
            const updatedSession = {
                players: [...session.players, userId],
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

            // TODO: Emit game:init event for both players

            return res.json({
                message: 'Game started',
                sessionId: session._id,
            });
        } else {
            return res.json({
                message: 'Session already full or started',
                sessionId: session._id,
            });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Cannot start game', error });
    }
};

module.exports = { startGameController };
