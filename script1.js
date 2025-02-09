/*
This script is used to call the start game api concurrently. 
test cases with promise array didnt seem to work hence added a script.
*/

const axios = require('axios');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { jwtSecret } = require('./config');

const tokens = {
    p1: jwt.sign({ userId: '679d22bb67a5f7079d0df583' }, jwtSecret, {
        expiresIn: '1h',
    }),
    p2: jwt.sign({ userId: '679da1e2ff86a15bc28e9fa4' }, jwtSecret, {
        expiresIn: '1h',
    }),
};

for (let i = 1; i <= 2; i++) {
    axios.post(`http://localhost:3000/game/start`, null, {
        headers: {
            Authorization: `Bearer ${tokens['p' + i]}`,
        },
    });
}
