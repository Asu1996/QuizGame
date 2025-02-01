const jwt = require('jsonwebtoken');
const { generateHashedPassword, comparePassword } = require('../utils/authUtils');
const User = require('../db/models/User');
const { jwtSecret } = require('../config');

const registerController = async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await generateHashedPassword(password);

        await User.create({ username, password: hashedPassword });

        return res.json({ message: 'Registration successful' });
    } catch (error) {
        return res.status(400).json({ message: 'Registration failed', error });
    }
};

const loginController = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Invalid username' });
        }

        const isPasswordMatched = await comparePassword(password, user.password);
        if (!isPasswordMatched) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // TODO: save mechanism?
        const token = jwt.sign({ userId: user._id }, jwtSecret, {
            expiresIn: '1h',
        });
        return res.json({ token });
    } catch (error) {
        return res.status(400).json({ message: 'Login failed', error });
    }
};

module.exports = { registerController, loginController };
