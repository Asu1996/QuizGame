const { generateHashedPassword } = require('../utils/authUtils');
const User = require('../db/models/User');

const registerController = async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await generateHashedPassword(password);

        await User.create({ username, password: hashedPassword });

        return res.send({ message: 'Registration successful' });
    } catch (error) {
        return res.status(400).json({ message: 'Registration failed', error });
    }
};

module.exports = { registerController };
