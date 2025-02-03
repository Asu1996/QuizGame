const WebSocket = require('ws');
const { expect } = require('chai');
const { describe, it } = require('mocha');

const WS_URL = 'ws://localhost:3000';

describe.skip('WebSocket test', function () {
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

    it('game:init event', (done) => {
        console.log('Sending game:init event...');
        ws.send(
            JSON.stringify({
                event: 'game:init',
                playerId: '679d22bb67a5f7079d0df583',
            })
        );

        ws.on('message', (message) => {
            const response = JSON.parse(message);
            console.log('Received message:', response);

            expect(response.event).to.equal('game:init');
            expect(response).to.have.property('sessionId');
            done();
        });

        setTimeout(() => {
            done(new Error('time out error'));
        }, 5000);
    });
});
