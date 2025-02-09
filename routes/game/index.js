const router = require('express').Router();

// This is the normal one with no concurrency handling
// const {
//     startGameController,
// } = require('../../controllers/gameControllers/gameController');

// handled concurrency using mongoose findOneAndUpdate
const {
    startGameController,
} = require('../../controllers/gameControllers/gameController2');

const { authMiddleware } = require('../../middlewares/authMiddleware');

router.post('/start', [authMiddleware], startGameController);

module.exports = router;
