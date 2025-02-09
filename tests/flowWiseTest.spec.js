const WebSocket = require('ws');
const { expect } = require('chai');
const { describe, it } = require('mocha');
const { callPostApi, callPostApiWithAuth } = require('./testUtils');

const WS_URL = 'ws://localhost:3000';

describe.skip('[DEV] Full flow test', () => {
    let ws;

    before((done) => {
        console.log('connecting to WebSocket...');
        ws = new WebSocket(WS_URL);

        ws.on('open', () => {
            console.log('connected to WebSocket');
            done();
        });

        ws.on('error', (error) => {
            console.error('WebSocket error:', error);
            done(error);
        });
    });

    after((done) => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.close();
            ws.on('close', () => {
                console.log('WebSocket closed');
                done();
            });
        } else {
            done();
        }
    });

    const tokens = {};
    let sessionId;
    const playerId1 = '679d22bb67a5f7079d0df583';
    const playerId2 = '679da1e2ff86a15bc28e9fa4';

    it('login p1', async () => {
        const res = await callPostApi('/auth/login', {
            username: 'p1',
            password: 'p1',
        });
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('token');

        tokens.p1 = res.body.token;
    }).timeout(-1);

    it('login p2', async () => {
        const res = await callPostApi('/auth/login', {
            username: 'p2',
            password: 'p2',
        });
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('token');

        tokens.p2 = res.body.token;
    }).timeout(-1);

    it('start game p1', async () => {
        const res = await callPostApiWithAuth('/game/start', tokens.p1);
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('sessionId');
    }).timeout(-1);

    it('start game p2', async () => {
        const res = await callPostApiWithAuth('/game/start', tokens.p2);
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('sessionId');

        sessionId = res.body.sessionId;
    }).timeout(-1);

    it('game:init p1', (done) => {
        ws.send(
            JSON.stringify({
                event: 'game:init',
                playerId: playerId1,
            })
        );

        ws.on('message', (message) => {
            const response = JSON.parse(message);

            expect(response.event).to.equal('game:init');
            expect(response).to.have.property('sessionId');
            expect(response.sessionId).to.equal(sessionId);
            done();
        });
    }).timeout(-1);

    it('game:init p2', (done) => {
        ws.send(
            JSON.stringify({
                event: 'game:init',
                playerId: playerId2,
            })
        );

        ws.on('message', (message) => {
            const response = JSON.parse(message);

            expect(response.event).to.equal('game:init');
            expect(response).to.have.property('sessionId');
            expect(response.sessionId).to.equal(sessionId);
            done();
        });
    }).timeout(-1);
});
