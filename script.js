import { API_GIF } from './const.js';

const IMAGE_IDENTIFIER = 'gif-clue';
const RESULT_IDENTIFIER = 'result';
const INPUT_IDENTIFIER = 'text-attempt';
const FORM_ATTEMPT = 'attempt-form';
const BUTTON_TRYAGAIN = 'button-retry'
var lang = 'es';
var word = '';
var attempts = 1;
var input = document.getElementById(INPUT_IDENTIFIER);
var divResult = document.getElementById(RESULT_IDENTIFIER);

let revealedLetters = [];

async function init() {
    word = await getNewRandomWord()
    revealedLetters =  word.split('').map(char => char === ' ' ? '&nbsp;' : '_');
    loadGifByWord();
    generatePreview();
    switchElementHide(FORM_ATTEMPT, false);
    switchElementHide(BUTTON_TRYAGAIN, true);
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
    divResult.innerHTML = revealedLetters.join(' ');
}

function showAnswer() {
    divResult.textContent = word.split('').join(' ')
}


async function getNewRandomWord() {
    try {
        const response = await fetch(`./data/${lang}.json`);
        
        if (!response.ok) {
            throw new Error(`Error al cargar el archivo JSON: ${response.statusText}`);
        }
        
        const { data = [] } = await response.json(); // Desestructuración con fallback
        const words = data.length ? data : ['fallback_word'];
        
        return words[Math.floor(Math.random() * words.length)];
    } catch (error) {
        console.error("Error", error);
        return 'fallback_word'; // Devolver una palabra por defecto en caso de error
    }
}

function removeAccents(letter) {
    return letter.normalize('NFD').replace(/\p{Diacritic}/gu, '');
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
        const fromWord = removeAccents(word[index].toLocaleLowerCase())
        const fromAttempt = removeAccents(letter.toLocaleLowerCase())
        if(word[index] && fromWord == fromAttempt) {
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
        alert('Congratulations you Win!');
    }

    if(!attempts){
        alert('You reached the number of attempts the correct word is '+ word)
        showAnswer();
    }

    if(!attempts || word == revealedLetters.join('')) {
        switchElementHide(FORM_ATTEMPT, true);
        switchElementHide(BUTTON_TRYAGAIN, false); 
    }
}



function tryAgain() {
    init();
}

function resetInput() {
    input.value = ''
}

function switchElementHide(id, value) {
    document.getElementById(id).hidden = value;
}

init();


window.attempt = attempt;
window.tryAgain = tryAgain;