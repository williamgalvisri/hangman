import { API_GIF } from './const.js';

const IMAGE_IDENTIFIER = 'gif-clue';
const RESULT_IDENTIFIER = 'result';
const INPUT_IDENTIFIER = 'text-attempt';
var word = 'camion';
var attempts = 7;
var input = document.getElementById(INPUT_IDENTIFIER);
var divResult = document.getElementById(RESULT_IDENTIFIER);

let revealedLetters = word.split('').map(() => '_');

function init() {
    loadGifByWord();
    generatePreview()
}

async function loadGifByWord() {
    const response = await fetch(`https://api.giphy.com/v1/gifs/search?q=${encodeURIComponent(word)}&api_key=${API_GIF}&limit=1&rating=g&lang=es&sort=relevant&offset=0`)
    const data = await response.json();
    const gifUrl = data.data.length ? data.data[0].images.original.url : '';

    document.getElementById(IMAGE_IDENTIFIER).src = gifUrl;
}

function generatePreview(index = null, letter = null) {
    if(index >= 0) {
        revealedLetters[index] = letter;
    }
    divResult.textContent = revealedLetters.join(' ')
}
/**
 * adivinar la palabra completa o por lo menos una de ellas en el orden cualquiera
 * si no adivina ninguna, se contara un intento
 * si adivina constantemente no se contara intentos
 */
function attempt() {
    if (!input.value.trim()) {
        alert('Please digit a valid value.')
        return;
    }

    let right = false;
    const attempt = input.value
    for (const [index, letter] of attempt.split('').entries()) {
        if(word[index] && word[index] == letter) {
            generatePreview(index, letter);
            right = true;
        }
    }

    if(!right) {
        --attempts
    }

    checkResult();
    resetInput();
}

function checkResult(){
    if(attempts && word == revealedLetters.join('')) {
        alert('Congratulations you Win!')
    }

    if(!attempts){
        alert('You reached the number of attempts the correct word is '+ word)
    }
}

function resetInput() {
    input.value = ''
}

init();


window.attempt = attempt;