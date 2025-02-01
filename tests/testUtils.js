const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);

async function callGetApi(apiUrl, queryParams = {}) {
    const app = require('../app');

    const chaiRouter = chai.request(app);
    return chaiRouter.get(apiUrl).query(queryParams);
}

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
    callPostApi,
};
