const express = require('express');
const app = express();
const api = require('./routes/api.js');
const mongodb = require('mongodb');
const URL = "mongodb://localhost:27017/question-db";

// decode req.body from form-data
app.use(express.urlencoded({ extended: true }));
// decode req.body from post 
app.use(express.json());

// Start server and connect to MongoDB
let db = null;
async function startServer() {
    const client = await mongodb.MongoClient.connect(URL, { useUnifiedTopology: true });
    db = client.db();
    console.log("connected");

    function setDatabase(req, res, next) {
        req.db = db;
        next();
    }
    app.use(setDatabase);
    app.use(api);

    await app.listen(3000, function() {
        console.log("Listening on port 3000!");
    })
}
startServer();