const { expect } = require('chai');
const { describe, it } = require('mocha');
const { callPostApi } = require('../../../testUtils');

describe('/login', () => {
    it('successful login', async () => {
        const res = await callPostApi('/auth/login', {
            username: 'p2',
            password: 'p2',
        });
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('token');
    }).timeout(-1);

    it('invalid username', async () => {
        const res = await callPostApi('/auth/login', {
            username: 'this-user-doesnot-exist',
            password: 'p2',
        });
        expect(res).to.have.status(401);
    }).timeout(-1);

    it('successful login', async () => {
        const res = await callPostApi('/auth/login', {
            username: 'p2',
            password: 'wrong-password',
        });
        expect(res).to.have.status(401);
    }).timeout(-1);
});
