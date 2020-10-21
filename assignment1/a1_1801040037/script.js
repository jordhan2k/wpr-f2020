// TODO(you): Write the JavaScript necessary to complete the assignment
let attID;
let answers = {};
let totalCorrect = 0;
let percent = 0;
//

//
const author = document.querySelector('#author');
const introSec = document.querySelector('#introduction');
//
const attemptSec = document.querySelector('#attempt-quiz');
const quizContent = attemptSec.querySelector('#quiz-content');
const submitDiv = attemptSec.querySelector('#sub-div');
//
const reviewSec = document.querySelector('#review-quiz');
const reviewContent = reviewSec.querySelector('#review-content')
const trydiv = reviewSec.querySelector('#try-div');

const btnStart = document.querySelector('#start-quiz');
btnStart.addEventListener('click', onBtnStartClick);



function onResponse(response) {
    return response.json();
}
// fetch attempt API from heroku.com
async function fetchAttemptAPI() {
    let promise = await fetch('https://wpr-quiz-api.herokuapp.com/attempts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(onResponse);
    attID = promise._id;
    console.log(attID);
    return promise;
}
// fetch result API after a submission
async function fetchSubmitAPI() {
    let promise = await fetch(`https://wpr-quiz-api.herokuapp.com/attempts/${attID}/submit`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(answers)
    }).then(onResponse);
    return promise;
}

/**
 * On clicking the Start button, generate a quiz
 */
async function onBtnStartClick() {
    introSec.classList.add('hidden');
    author.classList.add('hidden');

    document.body.scrollIntoView();

    const fetchedData = await fetchAttemptAPI();
    console.log(fetchedData);

    fetchedData.questions.map((index, qkey) => {
        // Area to display each question and its options
        const questionArea = createQuestion(qkey, index.text, index._id)
        quizContent.appendChild(questionArea);
        // Option area
        const optionArea = document.createElement('form');
        optionArea.setAttribute('class', 'opt-area');
        optionArea.setAttribute('id', index._id);
        questionArea.appendChild(optionArea);

        // loop through the answers array and display options
        index.answers.map((choice, key) => {
            const option = createOption(index._id, key, choice);
            optionArea.appendChild(option);
        })
    })
    submitDiv.classList.remove('hidden');
    const btnSubmit = submitDiv.querySelector('#submit-answer');
    btnSubmit.addEventListener('click', onBtnSubmitClick);
}

/**
 * Create an area to display a question
 */
function createQuestion(qkey, indexText) {
    const questionArea = document.createElement('div');
    questionArea.setAttribute('class', 'question');
    // Area to display question text
    const questionText = document.createElement('div');
    questionText.setAttribute('class', 'question-text');
    // Display the index of questions
    const questionIndex = document.createElement('h2');
    questionIndex.innerHTML = `Question ${qkey + 1 } of 10`;
    questionArea.appendChild(questionIndex);
    // Question text content
    const questionContent = document.createElement('p');
    questionContent.innerHTML = indexText;
    questionArea.appendChild(questionContent);
    return questionArea;
}

/**
 * Create an option which allowing checking
 */
function createOption(qID, key, choice) {
    const option = document.createElement('div');
    option.setAttribute('class', 'option');
    option.setAttribute('id', `${key}`)
    option.innerHTML =
        `<input type="radio" id="${qID}-${ key }" name="${qID}" value="${key}">
    <label for="${qID}-${ key }">${choice}</label>`;

    const label = option.querySelector('label');
    label.textContent = choice;
    option.addEventListener('click', changeClick);

    return option;
}


/**
 * Change the color of the checked option
 */
function changeClick(event) {
    const target = event.currentTarget;
    const form = target.parentElement;
    const input = target.querySelector('input');
    input.checked = true;

    const activeDiv = form.querySelector('.click-change');
    if (activeDiv) {
        activeDiv.classList.remove('click-change');
    }
    target.classList.add('click-change');

    answers[`${form.id}`] = target.id;


}
/**
 * On clicking the submit button
 * Comfirm before showing the review content
 */
async function onBtnSubmitClick() {
    if (confirm("Do you really want to submit your answers?")) {
        document.body.scrollIntoView();
        attemptSec.classList.add('hidden');
        reviewSec.classList.remove('hidden');
        console.log(answers);
        const fetchedResult = await fetchSubmitAPI();
        console.log(fetchedResult);
        console.log(fetchedResult.answers);
        const correctAnswers = fetchedResult.correctAnswers;
        fetchedResult.questions.map((index, qkey) => {

            // Area to display each question
            const questionArea = createQuestion(qkey, index.text, index._id);
            reviewContent.appendChild(questionArea);

            // Option area
            const optionArea = document.createElement('form');
            optionArea.setAttribute('class', 'opt-area');
            optionArea.setAttribute('id', index._id);
            questionArea.appendChild(optionArea);

            // loop through the answers array and display options
            index.answers.map((choice, key) => {
                const option = createOptionReview(index._id, key, choice, correctAnswers);
                optionArea.appendChild(option);
            })
        })

        const resultDiv = document.querySelector('#try-div');
        // const score = fetchedResult.score;
        percent = (totalCorrect / 10) * 100;
        resultDiv.innerHTML = `<h2>Results</h2>
    <p id="diem">${totalCorrect}/10</p>
    <p style="font-weight: bold;">${percent}%</p>
    <p id="textscore"> ${fetchedResult.scoreText}</p>
    <div id="try-again" class="button blue">Try again</div>`;

        const btnTry = document.querySelector('#try-again');
        btnTry.addEventListener('click', onBtnTryClick);

    }
}

/**
 * Create an option which is used in review mode
 */
function createOptionReview(qID, key, choice, correctAnswers) {
    const option = document.createElement('div');
    option.setAttribute('class', 'option-r');
    option.setAttribute('id', `${key}`)
    option.innerHTML =
        `<input type="radio" id="${qID}-${ key }" name="${qID}" value="${key}">
    <label for="${qID}-${ key }"></label>`;
    const input = option.querySelector('input');
    input.disabled = true;
    const label = option.querySelector('label');
    label.disabled = true;
    const div = input.parentElement;
    if (parseInt(answers[qID]) === key) {
        input.checked = true;
    }
    if (key === parseInt(correctAnswers[qID]) && parseInt(answers[qID]) === key) {
        div.classList.add('correct-green');
        totalCorrect++;
    }
    if (key === parseInt(correctAnswers[qID]) && parseInt(answers[qID]) !== key) {
        div.classList.add('correct-gray');
    }
    if (parseInt(correctAnswers[qID]) !== parseInt(answers[qID]) && parseInt(answers[qID]) === key) {
        div.classList.add('wrong');
    }
    console.log(totalCorrect);
    label.textContent = choice;
    return option;
}

function onBtnTryClick() {
    document.body.scrollIntoView;
    location.reload();
}