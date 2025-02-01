const bcrypt = require('bcrypt');
const { saltRounds } = require('../config');

/**
 * @param {string} originalPassword
 * @returns {Promise<{string}>}
 */
const generateHashedPassword = async (originalPassword) => {
    const salt = await bcrypt.genSalt(saltRounds);
    return bcrypt.hash(originalPassword, salt);
};

module.exports = { generateHashedPassword };
