const router = require('express').Router();
const { registerController } = require('../../controllers/authControllers');

router.post('/register', registerController);

module.exports = router;
