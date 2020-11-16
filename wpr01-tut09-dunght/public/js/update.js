// ====== Ex1: promise.then() -> async/await
// ====== Ex2: GET -> POST message
// function showUpdateResult(response) {
//     const resultView = formUpdate.querySelector('#result');
//     resultView.textContent = response.message;
// }

// function onUpdateSuccess(response) {
//     response.json().then(showUpdateResult);
// }

// function onUpdate(event) {
//     event.preventDefault();

//     const wordInput = formUpdate.querySelector('#word');
//     const definitionInput = formUpdate.querySelector('#definition');

//     const word = encodeURI(wordInput.value);
//     const definition = encodeURI(definitionInput.value);

//     fetch(`/update?word=${word}&definition=${definition}`).then(onUpdateSuccess);
// }
async function onUpdate(event) {
    event.preventDefault();

    const wordInput = formUpdate.querySelector('#word');
    const definitionInput = formUpdate.querySelector('#definition');

    const word = wordInput.value;
    const definition = definitionInput.value;

    const data = {
        word: word,
        definition: definition
    };

    const response = await fetch(`/update/${word}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    const json = await response.json();

    // show update result
    const resultView = formUpdate.querySelector('#result');
    resultView.textContent = json.message;
}

const formUpdate = document.querySelector('#form-update');
formUpdate.addEventListener('submit', onUpdate);