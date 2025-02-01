/**
 * @type {{webAppPort: number, saltRounds: number, mongoUri: string, jwtSecret: string}}
 */
const config = {
    webAppPort: 3000,
    saltRounds: 10,
    mongoUri: process.env.MONGO_URI,
    jwtSecret: process.env.JWT_SECRET,
};

module.exports = config;
