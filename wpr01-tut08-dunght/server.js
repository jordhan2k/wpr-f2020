const express = require('express');
const app = express();

// serve static files (html, css, js, images...)
app.use(express.static('public'));

// decode req.body from form-data
app.use(express.urlencoded({ extended: true }));
// decode req.body from post body message
app.use(express.json());

app.get('/hello', function(req, res) {
    res.send('Hello ' + req.query.name + '!');
});


// ####################  TUT8  ########################


// Ex2 - task 2
const mongo = require('mongodb');
const { MongoClient } = mongo.MongoClient;

const DBS_NAME = 'eng-dict';
const MONGO_URL = `mongodb://localhost27017/${DBS_NAME}`;

let db = null;
let collection = null;

async function startServer() {
    // Set db and collectio variables be4 strating the server
    db = await MongoClient.connect(MONGO_URL).db();
    collection = db.collection("words");

    await app.listen(3000);
    console.log('Listening on port 3000');
}
startServer();

// Exercise 3
// [R]
// find()
async function printAllWords() {
    const results = await collection.find().toArray();
    for (const re of results) {
        console.log(`Word ${re.word}, defition: ${re.defition}`);
    }
}

app.get('/words', printAllWords);

// Exercise 4: 
// [U]
// updateOne()
async function onSetWord(req, res) {
    const routeParams = req.params;
    const word = routeParams.word.toLowerCase();
    const definition = req.body.definition;

    const query = { word: word };
    const newEntry = { word: word, definition: definition };
    const params = { upsert: true };
    const response = await collection.update(query, newEntry, params);

    res.json({ success: true });
}
app.post('/set/:word', onSetWord);

// Exercise 5:
// [C]
// insertOne()
async function onCreateWord(req, res) {

    const word = req.body.word;
    const definition = req.body.definition;

    const WORDS = collection.find({ word: word }).toArray();


    if (WORDS.length() !== 0) { // word already exists
        return res.status(409).end(); // CONFLICT
    }

    collection.insertOne({ word: word, definition: definition });
    res.status(201).json({ word: definition });


}
app.post('/words', onCreateWord);

// Exercise 6: 
// [D]
// deletOne() 
async function onDeleteWord(req, res) {
    const word = req.params.word;
    const definition = req.body.definition;

    const WORDS = collection.find({ word: word }).toArray();

    if (WORDS.length() == 0) { // word not exist
        return res.status(404).end(); // NOT FOUND
    }

    collection.deleteOne({ word: word })
    res.json({ word: definition }); // OK (by default) 

}
app.delete('/words/:word', onDeleteWord);








// ############## SOLUTION FOR TUT 7 ################
// get all words
// app.get('/words', function(req, res) {
//     res.json(WORDS); // OK (by default)
// });

// create a new word
// app.post('/words', function(req, res) {
//     const word = req.body.word;
//     const definition = req.body.definition;

//     if (word in WORDS) { // word already exists
//         return res.status(409).end(); // CONFLICT
//     }

//     WORDS[word] = definition;
//     res.status(201).json({ word: definition });
// });

// update a word
// app.put('/words/:word', function(req, res) {
//     const word = req.params.word;
//     const definition = req.body.definition;

//     if (!(word in WORDS)) { // word not exist
//         return res.status(404).end(); // NOT FOUND
//     }

//     WORDS[word] = definition;
//     res.json({ word: definition }); // OK (by default)
// });

// delete a word
// app.delete('/words/:word', function(req, res) {
//     const word = req.params.word;
//     const definition = req.body.definition;

//     if (!(word in WORDS)) { // word not exist
//         return res.status(404).end(); // NOT FOUND
//     }

//     WORDS[word] = definition;
//     res.json({ word: definition }); // OK (by default)
// });

// app.listen(3000, function() {
//     console.log('Listening on port 3000!');
// });