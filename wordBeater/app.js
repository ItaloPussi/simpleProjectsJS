window.addEventListener("load", init)

// DOM Elements variables
const secondsElement = document.querySelector("#seconds")
const wordElement = document.querySelector("#current-word")
const inputElement = document.querySelector("#word-input")
const timeElement = document.querySelector("#time")
const scoreElement = document.querySelector("#score")
const highscoreElement = document.querySelector("#highscore")
const feedbackElement = document.querySelector("#message")
const difficultyElement = document.querySelector("#difficulty")
const pluralElement = document.querySelector("#pluralSeconds")
// Avaliable levels
const levels = {
    easy: 5,
    medium: 3,
    hard: 2,
    master: 1
}

const levelsColors = {
    easy: "#0275db",
    medium: '#5cb85c',
    hard: '#f0ad4e',
    master: '#d9534f'
}
// To change level
let currentLevel = 3;

// Global Variables
let score = 0
let time = currentLevel-1
let isPlaying;
let started = false

//  Initialize game
function init(){
    let highscore = localStorage.getItem("highscoreWordBeater") === null ? 0 : localStorage.getItem("highscoreWordBeater")
    highscoreElement.textContent = highscore

    // Set difficulty
    if(localStorage.getItem("difficultyWordBeater") != null){
        difficultyElement.value = localStorage.getItem("difficultyWordBeater")
    }
    difficultyElement.addEventListener("change", setDifficulty)
    setDifficulty()

    // Show the time selected in the UI
    secondsElement.textContent = currentLevel
    // Load random word from array
    showWord(words)
    
    // Start matching on word input
    inputElement.addEventListener("input", ()=>{
        if(!started){
            // Call countdown every second
            setInterval(countdown, 1000)
            started = true
        }

        startMatch()
    })
    

    // Check game status
    setInterval(checkStatus, 50)
}

// Set the difficulty selected 
function setDifficulty(){
    localStorage.setItem("difficultyWordBeater", difficultyElement.value)
    currentLevel = levels[difficultyElement.value]
    secondsElement.textContent = currentLevel
    secondsElement.style.color = levelsColors[difficultyElement.value]
    timeElement.textContent = currentLevel
    pluralElement.style.display = difficultyElement.value === 'master' ? 'none' : ''
}

// Start the match
function startMatch(){
    if(matchWords()){
        isPlaying = true
        time = currentLevel+1;
        showWord(words)
        inputElement.value = ''
        score++
    }
    scoreElement.textContent = score >=0 ? score : 0
    checkHighscore()

}

// Match word to input
function matchWords(){
    if(inputElement.value === wordElement.textContent){
        feedbackElement.textContent = "Correct!!!"
        return true
    } else {
        feedbackElement.textContent = ''
        return false
    }
}
// Pick & show random word
function showWord(words){
  let randIndex = Math.floor(Math.random() * words.length)
  let word = words[randIndex]
  wordElement.textContent = word  
}

// Countdown timer
function countdown(){
    // Make sure time is not run out
    if (time > 0) {
        time--
    } else if(time === 0){
        // Game is over
        isPlaying = false
    }

    timeElement.textContent = time
}

// Check game status
function checkStatus(){
    if (!isPlaying && time === 0) {
        feedbackElement.textContent = 'Game Over!!!'
        score = -1
    }
}

function checkHighscore(){
    if(score > highscoreElement.textContent){
        highscoreElement.textContent = score
        localStorage.setItem("highscoreWordBeater", score)
    }
}

