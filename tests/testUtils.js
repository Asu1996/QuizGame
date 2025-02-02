const chai = require('chai');
const chaiHttp = require('chai-http');

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

// /**
//  * @param {string} apiUrl
//  * @param {string} username
//  * @param {any} [queryParams]
//  * @returns {Promise<Response>}
//  */
// async function callGetApiWithAuth(apiUrl, queryParams = {}) {
//     const app = require('../app');
//     const chaiRouter = chai.request(app);

//     const token = jwt.sign({ userId: user._id }, jwtSecret, {
//         expiresIn: '1h',
//     });
//     return chaiRouter.get(apiUrl).query(queryParams);
// }

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

module.exports = {
    callGetApi,
    // callGetApiWithAuth,
    callPostApi,
};
