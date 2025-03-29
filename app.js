const scoreDisplay = document.getElementById('score-display')
const questionDisplay = document.getElementById('question-display')

const apiUrl = "https://twinword-word-association-quiz.p.rapidapi.com/type1/?level=3&area=sat"
const apiKey = "9486777915msh9f69daa8af5aa98p10771bjsn8dcf09ee88c2"

const options = {
    method: "GET",
    headers: {
        "X-RapidAPI-Key": "9486777915msh9f69daa8af5aa98p10771bjsn8dcf09ee88c2",
        "X-RapidAPI-Host": "twinword-word-association-quiz.p.rapidapi.com" 
    }
};
async function fetchData(url, options) {
    try {
        const response = await fetch(url, options);
        const result = await response.text();
        console.log(result);
    } catch (error) {
        console.error(error);
    }
}


const questions = [
    {
        quiz: ['value', 'estimate', 'evaluate'],
        options: ['jury', 'assess'],
        correct: 2
    },
    {
        quiz: ['value', 'estimate', 'evaluate'],
        options: ['jury', 'assess'],
        correct: 2
    },
    {
        quiz: ['value', 'estimate', 'evaluate'],
        options: ['pury', 'assess'],
        correct: 2
    },
    {
        quiz: ['value', 'estimate', 'evaluate'],
        options: ['jury', 'assess'],
        correct: 2
    },
    {
        quiz: ['value', 'estimate', 'evaluate'],
        options: ['jury', 'assess'],
        correct: 2
    },
]

let score = 0
let clicked = []
scoreDisplay.textContent = score


function populateQuestions() {
    questions.forEach(question => {
        const questionBox = document.createElement('div')
        questionBox.classList.add('question-box')

        const logoDisplay = document.createElement("h1")
        logoDisplay.textContent = "∞"
        questionBox.append(logoDisplay)

        question.quiz.forEach(tip => {
            const tipText = document.createElement("p")
            tipText.textContent = tip
            questionBox.append(tipText)
        })

        const questionButtons = document.createElement("div")
        questionButtons.classList.add('question-buttons')
        questionBox.append(questionButtons)

        question.options.forEach((option, optionIndex) => {
            const questionButton = document.createElement("button")
            questionButton.classList.add("question-button")
            questionButton.textContent = option

            questionButtons.append(questionButton)

            questionButton.addEventListener("click", () => checkAnswer(questionBox, questionButtons, option, optionIndex + 1, question.correct))

        })

        answerDisplay = document.createElement("div")
        answerDisplay.classList.add("answer-display")
        questionBox.append(answerDisplay)

        questionDisplay.append(questionBox)
    })
}


function checkAnswer(questionBox, questionButtons, option, optionIndex, correctAnswer) {
    if (optionIndex === correctAnswer) {
        score++
        scoreDisplay.textContent = score
        addResult(questionBox, "Correct", "correct")
    }
    else {
        score--
        scoreDisplay.textContent = score
        addResult(questionBox, "Incorrect", "incorrect")
    }

    clicked.push(option)
    if (clicked.includes(option)) {
        questionButtons.style.pointerEvents = "none";
        questionButtons.style.opacity = 0.5
    }
}


function addResult(questionBox, answer, className) {
    const answerDisplay = questionBox.querySelector('.answer-display')
    answerDisplay.classList.remove('incorrect')
    answerDisplay.classList.remove('correct')
    answerDisplay.classList.add(className)
    console.log(answerDisplay)
    answerDisplay.textContent = answer
}

fetchData(apiUrl, options)
populateQuestions()