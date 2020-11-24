const express = require('express');
const mongodb = require('mongodb');
const router = express.Router();

/**
 * CREATE AN ATTEMPT  +  Bonus 1
 */
async function createAttempt(req, res) {
    const questions = await req.db.collection("questions").aggregate([{ $sample: { size: 10 } }]).toArray();

    // save all correct answers to an object
    let correctAnswers = {};
    for (const qu of questions) {
        correctAnswers[qu._id] = qu.correctAnswer;
    }

    // create a new object : attempt
    let attempt = {
        questions: questions,
        correctAnswers,
        completed: false,
        startedAt: new Date()

    };

    // insert the attempt created above into the database
    let insertAttempt = await req.db.collection("attempts").insertOne(attempt);

    // retrieve the attemp currently inserted 
    let findAttempt = await req.db.collection("attempts").findOne({ _id: mongodb.ObjectId(`${insertAttempt.insertedId}`) })
    console.log(findAttempt);


    let questionList = [];
    for (const aq of findAttempt.questions) {
        let q = {};
        q["text"] = aq.text;
        q["answers"] = aq.answers;
        q["_id"] = q._id;
        questionList.push(q);
    }

    let returnAttempt = {
        _id: findAttempt._id,
        questions: questionList,
        // BONUS 1: No cheating
        // correctAnswers: correctAnswers,
        completed: findAttempt.completed,
        startedAt: findAttempt.startedAt,
    };

    res.json(returnAttempt);
}


/**
 * SUBMIT AN ATTEMPT 
 */
async function submitAttempt(req, res) {
    const attemptID = req.params.id;
    const answers = req.body.answers;
    console.log(answers);
    let score = 0;
    let scoreText = "";

    // find the attempt with corresponding id
    const attempt = await req.db.collection("attempts").findOne({ _id: mongodb.ObjectId(`${attemptID}`) });

    const correctAnswers = attempt.correctAnswers;
    console.log(attempt.completed);

    // if the attempt is not completed, update score and scoreText
    if (attempt.completed == false) {
        for (const ans in correctAnswers) {
            for (const an in answers) {
                if (ans == an) {
                    if (parseInt(correctAnswers[ans]) == parseInt(answers[an])) {
                        score += 1;
                    }
                }
            }
        }
        if (score < 5) {
            scoreText = "Practice more to improve it :D";
        }
        if (score == 6 || score == 5) {
            scoreText = "Good, keep up!";
        }
        if (score == 7 || score == 8) {
            scoreText = "Good, keep up!";
        }
        if (score > 8) {
            scoreText = "Perfect!!";
        }


        const upd = {
            questions: attempt.questions,
            correctAnswers: attempt.correctAnswers,
            startedAt: attempt.startedAt,
            answers,
            score,
            scoreText,
            completed: true
        };

        const update = await req.db.collection("attempts").updateOne({ _id: mongodb.ObjectId(`${attemptID}`) }, { $set: upd });

    }

    const result = await req.db.collection("attempts").findOne({ _id: mongodb.ObjectId(`${attemptID}`) });

    res.json(result);
}


/**
 * BONUS 2
 */
async function getAttempt(req, res) {
    const attemptID = req.params.id;
    const attempt = await req.db.collection("attempts").findOne({ _id: mongodb.ObjectId(`${attemptID}`) });

    let questionList = [];
    for (const aq of attempt.questions) {
        let q = {};
        q["text"] = aq.text;
        q["answers"] = aq.answers;
        q["_id"] = q._id;
        questionList.push(q);
    }

    const response = {
        _id: attemptID,
        questions: questionList,
        completed: attempt.completed,
        startedAt: new Date()
    };

    res.json(response);
}

// Create an attempt + Bonus 1
router.post('/attempts', createAttempt);

// Submit an attempt
router.post('/attempts/:id/submit', submitAttempt);

// Get an attempt
router.get('/attempts/:id', getAttempt);

module.exports = router;