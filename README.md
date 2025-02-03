Setup: `npm i`
Run on local: `npm run dev`

This needs `MONGO_URI` and `JWT_SECRET` in `.env` file to run. I used MongoDB Atlas for the database.

This is currently deployed on Render with URL: https://quizgame-k89u.onrender.com

Please suggest any improvements regarding WebSockets? (Implemented WebSockets for the first time)

Things that can be added/improved:
- save jwt login token to db and check for expiry
- test cases with websockets (since postman collection could not be exported)
- time limit for answering a question. it is unlimited for now.
- setup github actions to deploy to Render on push to main branch.
- setup logs for all requests and responses.