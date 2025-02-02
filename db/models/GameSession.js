const mongoose = require('mongoose');

const gameSessionSchema = new mongoose.Schema(
    {
        players: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        questions: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Question',
            },
        ],
        answers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        finalScores: {
            type: Map,
            of: Number,
            default: {},
        },
        status: {
            type: String,
            enum: ['waiting', 'in-progress', 'completed'],
            default: 'waiting',
        },
        winner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('GameSession', gameSessionSchema);
