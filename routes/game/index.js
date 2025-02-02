const router = require('express').Router();
const { startGameController } = require('../../controllers/gameController');
const { authMiddleware } = require('../../middlewares/authMiddleware');

router.post('/start', [authMiddleware], startGameController);

module.exports = router;
