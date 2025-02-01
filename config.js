/**
 * @type {{webAppPort: number, saltRounds: number, mongoUri: string}}
 */
const config = {
    webAppPort: 3000,
    saltRounds: 10,
    mongoUri: process.env.MONGO_URI,
};

module.exports = config;
