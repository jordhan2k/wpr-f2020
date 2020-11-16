async function onSubmit(event) {
    event.preventDefault();

    const input = form.querySelector('#key');
    const key = input.value.toLowerCase();

    const response = await fetch('/lookup/' + key);
    const json = await response.json();

    // === Ex2: lookup using db - notify user if no word matched with given key
    if (json === null) {
        alert('Oops! word not found.');
        return;
    }

    // show definition
    const resultView = document.querySelector('#result');
    const wordView = resultView.querySelector('#word');
    const definitionView = resultView.querySelector('#definition');

    wordView.textContent = json.word;
    definitionView.textContent = json.definition;
    resultView.classList.remove('hidden');

    // show update form
    const formUpdate = document.querySelector('#form-update');
    const wordInput = formUpdate.querySelector('#word');
    const definitionInput = formUpdate.querySelector('#definition');

    wordInput.value = json.word;
    definitionInput.value = json.definition;
    formUpdate.classList.remove('hidden');
}

const form = document.querySelector('form');
form.addEventListener('submit', onSubmit);