/*
This script is used to call the start game api concurrently. 
test cases with promise array didnt seem to work hence added a script.
*/

const axios = require('axios');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { jwtSecret } = require('./config');

const userIds = [
    '679d22bb67a5f7079d0df583', // p1
    '679da1e2ff86a15bc28e9fa4', // p2
    '679da4d580970db139357664', // p3
    '67a855445274519b0df318c4', // p4
    '679f9fbfb3d94f3f1e7b078f', // p5
    '679fa1f2b3d94f3f1e7b07af', // p6
    '67a8555c5274519b0df318c6', // p7
    '67a855635274519b0df318c8', // p8
    '67a855685274519b0df318ca', // p9
    '67a8556e5274519b0df318cc', // p10
];

const tokens = userIds.map((userId) =>
    jwt.sign({ userId }, jwtSecret, { expiresIn: '1h' })
);

for (let i = 0; i < userIds.length; i++) {
    axios.post(`http://localhost:3000/game/start`, null, {
        headers: {
            Authorization: `Bearer ${tokens[i]}`,
        },
    });
}
