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

/**
 * @param {string} enteredPassword
 * @param {string} userPassword
 * @returns {Promise<boolean>}
 */
const comparePassword = async (enteredPassword, userPassword) => {
    return bcrypt.compare(enteredPassword, userPassword);
};

module.exports = { generateHashedPassword, comparePassword };
