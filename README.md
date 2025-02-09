Setup: `npm i` <br>
Run on local: `npm run dev`

This needs `MONGO_URI` and `JWT_SECRET` in `.env` file to run. I used MongoDB Atlas for the database.

This is currently deployed on Render with URL: https://quizgame-k89u.onrender.com

Please suggest any improvements regarding WebSockets? (Implemented WebSockets for the first time)

Things that can be added/improved:

-   save jwt login token to db and check for expiry
-   test cases with websockets (since postman collection could not be exported)
-   time limit for answering a question. it is unlimited for now.
-   setup github actions to deploy to Render on push to main branch.
-   setup logs for all requests and responses.

TODO:

-   fix concurrent requests issue
    -   no use of queues
    -   no queue patterns
    -   no use of other services
    -   no use of nodejs sync code
    -   only db
    -   last resort: transactions & locks

fixes:

-   tried findOneAndUpdate with upsert: true
    -   did not work as expected for 10 requests in parallel. even if the fetch & update was atomic, but the whole process was not atomic. hence either some players missed getting into sessions.

- using withTransaction to make the whole process atomic.