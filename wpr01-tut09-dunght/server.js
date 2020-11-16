const express = require('express');
// === Ex1-task1: install mongodb & require
const mongodb = require('mongodb');

// dictionary - no use since we now use mongodb
// let DICTIONARY = {
//     'dog': 'friend',
//     'cat': 'boss'
// };

const app = express();

// decode POST body message
app.use(express.urlencoded()); // submit form data
app.use(express.json()); // submit json with fetch

// serve static files
app.use(express.static('public'));

app.get('/lookup/:key', async function (req, res) {
    const key = req.params.key;
    // === Ex2: lookup word from db
    // const definition = DICTIONARY[key];

    // const response = {
    //     word: key,
    //     definition: definition
    // };

    // res.json(response);
    const word = await db.collection('words').findOne({word: key});

    res.json(word);
});
// test url: http://localhost:8080/lookup/여자

app.post('/update/:word', async function (req, res) { // no jsonParser in need (see line #12-13)
    const word = req.params.word;
    const definition = req.body.definition;

    // update word in dictionary - add if not existed
    // === Ex3: update word definition
    // DICTIONARY[word] = definition;
    await db.collection('words').update({word: word}, {word: word, definition: definition});
    
    const response = {
        message: `Updated word: ${word}`
    };

    res.json(response);
});

let db = null;
app.listen(8080, async function () {
    // === Ex1- task 2: connect db
    const mongoClient = await mongodb.MongoClient.connect('mongodb://localhost:27017/eng-dict');
    db = mongoClient.db();

    console.log('Server started listening on port 8080!');
});