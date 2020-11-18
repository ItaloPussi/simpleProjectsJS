const questionContainer = document.querySelector("#question-container")

const questionElement = document.querySelector("#question")
const answerButtons = document.querySelectorAll("#answer-buttons button")

function addClickListener(){
    answerButtons.forEach(button => button.addEventListener("click", selectAnswer))
}

function removeClickListener(){
    answerButtons.forEach(button => button.removeEventListener("click", selectAnswer))
}

const start = document.querySelector(".start-btn")
const next = document.querySelector(".next-btn")

let shuffledQuestions, currentQuestionIndex

start.addEventListener("click", startGame)
next.addEventListener("click", ()=>{
    currentQuestionIndex++
    setNextQuestion()
})

function startGame(){
    start.classList.add("hidden")
    shuffledQuestions = questions.sort(()=> Math.random() - .5)
    currentQuestionIndex = 0
    questionContainer.classList.remove("hidden")
    setNextQuestion()
}

function setNextQuestion(){

    addClickListener()
    next.classList.add("hidden")
    showQuestion(shuffledQuestions[currentQuestionIndex])

}

function showQuestion(question){
    answerButtons.forEach(button=> {
        button.classList.remove("wrong")
        button.classList.remove("correct")
    })
    document.body.classList = ''
    questionElement.innerText = question.question
    questionElement.dataset.id = question.id
    answerButtons.forEach((element, index)=>{
        element.innerText = question.answers[index].text
        element.dataset.id = index
    })
}

function selectAnswer(){
    removeClickListener()
    const questionId = questionElement.dataset.id
    const selectedAnswer = this.dataset.id
    let correct = false
    questions.forEach(question =>{
        if(question.id == questionId){
            question.answers.forEach((answer, index)=>{
                if(index == selectedAnswer){
                    correct = answer.correct
                }
            })
        }
    })
    
    correct ? this.classList.add("correct") : this.classList.add("wrong")
    correct ? document.body.classList.add("correct") : document.body.classList.add("wrong")
    next.classList.remove("hidden")

    if(currentQuestionIndex >= questions.length-1){
        next.classList.add("hidden")
        start.innerText = "Restart"
        start.classList.remove("hidden")
    }
}

const questions = [
    {
        id: 0,
        question: "What is 2 + 2",
        answers: [
            {text: "4", correct:true},
            {text: "22", correct:false},
            {text: "13", correct:false},
            {text: "0", correct:false},
        ]
    },
    {
        id: 1,
        question: "What is 4 * 5",
        answers: [
            {text: "9", correct:false},
            {text: "20", correct:true},
            {text: "1.5", correct:false},
            {text: "10", correct:false},
        ]
    },
    {
        id: 2,
        question: "What is 2 / 0",
        answers: [
            {text: "2", correct:false},
            {text: "0", correct:false},
            {text: "Error", correct:true},
            {text: "1", correct:false},
        ]
    }
]