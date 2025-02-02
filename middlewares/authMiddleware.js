const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config');

const User = require('../db/models/User');

const authMiddleware = async (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decodedInfo = jwt.verify(token, jwtSecret);
        
        const userDoc = await User.findById(decodedInfo.userId);
        if (!userDoc) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        req.user = decodedInfo;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = { authMiddleware };
