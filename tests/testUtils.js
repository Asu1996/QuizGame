require('dotenv').config();
const jwt = require('jsonwebtoken');
const chai = require('chai');
const chaiHttp = require('chai-http');

const { jwtSecret } = require('../config');

chai.use(chaiHttp);

/**
 * @param {string} apiUrl
 * @param {any} [queryParams]
 * @returns {Promise<Response>}
 */
async function callGetApi(apiUrl, queryParams = {}) {
    const app = require('../app');

    const chaiRouter = chai.request(app);
    return chaiRouter.get(apiUrl).query(queryParams);
}

/**
 * @param {string} apiUrl
 * @param {any} payload
 * @returns {Promise<Response>}
 */
async function callPostApi(apiUrl, payload) {
    const app = require('../app');

    const chaiRouter = chai.request(app);

    return chaiRouter
        .post(apiUrl)
        .set('content-type', 'application/json')
        .send(payload);
}

/**
 * @param {string} apiUrl
 * @param {string} token
 * @param {any} [payload]
 * @returns {Promise<Response>}
 */
async function callPostApiWithAuth(apiUrl, token, payload) {
    const app = require('../app');

    const chaiRouter = chai.request(app);

    return chaiRouter
        .post(apiUrl)
        .set('content-type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send(payload);
}

/**
 * @param {string} apiUrl
 * @param {string} token
 * @param {any} [payload]
 * @returns {Promise<Response>}
 */
async function callPostApiWithUserId(apiUrl, userId, payload) {
    const app = require('../app');
    const chaiRouter = chai.request(app);

    const token = jwt.sign({ userId }, jwtSecret, {
        expiresIn: '1h',
    });

    return chaiRouter
        .post(apiUrl)
        .set('content-type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send(payload);
}

module.exports = {
    callGetApi,
    callPostApi,
    callPostApiWithAuth,
    callPostApiWithUserId,
};
