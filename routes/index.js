const router = require('express').Router();

router.use('/auth', require('./auth'));
router.use('/game', require('./game'));

module.exports = router;
