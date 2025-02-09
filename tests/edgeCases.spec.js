const { expect } = require('chai');
const { describe, it } = require('mocha');
const {
    callPostApi,
    callPostApiWithAuth,
    callPostApiWithUserId,
} = require('./testUtils');

describe('concurrent apis test', () => {
    const tokens = {};
    let sessionId;
    const playerId1 = '679d22bb67a5f7079d0df583'; // username: p1
    const playerId2 = '679da1e2ff86a15bc28e9fa4'; // username: p2

    it.skip('start game p1', async () => {
        const res = await callPostApiWithUserId('/game/start', playerId1);
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('sessionId');
    }).timeout(-1);

    it.skip('start game concurrent', async () => {
        const res = await callPostApiWithUserId('/game/start', playerId1);

        const taskList = [
            callPostApiWithUserId('/game/start', playerId1),
            callPostApiWithUserId('/game/start', playerId2),
        ];

        const resList = await Promise.all(taskList);
        expect(resList[0].body.sessionId).to.equal(resList[1].body.sessionId);

        // expect(res).to.have.status(200);
        // expect(res.body).to.have.property('sessionId');
    }).timeout(-1);
});
