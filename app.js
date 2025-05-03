const scoreDisplay = document.getElementById('score-display')
const questionDisplay = document.getElementById('question-display')
const rankHeading = document.getElementById("rank-heading")
const levelHeading = document.getElementById("level-heading")
let questionBox = document.querySelectorAll('question-box')

let apiUrl = "https://twinword-word-association-quiz.p.rapidapi.com/type1/?level=1&area=es"
localStorage.setItem('rank', 'es')

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
        const result = await response.json();
        console.log(result);
        return result
    } catch (error) {
        console.error(error);
    }
}

gameRanks = {
    'es': 'launch pad', 'ms': 'word garden', 'hs': 'high stakes', 'ksat': 'seoul smarts', 'toeic': 'office buzz', 'toefl': 'global grammar', 'teps': 'word reactor', 'sat': 'verbal vault', 'ielts': 'culture clash', 'gre': 'think tank', 'gmat': 'biz whiz', 'overall': 'final frontier'}


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

function rankOptions() {
    const select = document.createElement('select')
    select.id = 'select-game'
    for (const key in gameRanks) {
        const option = document.createElement('option')
        option.value = gameRanks[key]
        option.textContent = gameRanks[key]
        select.appendChild(option)
    }
    select.addEventListener("change", changeRank)
    rankHeading.appendChild(select)
}

function levelOptions() {
    let inputLevel = document.createElement('input')
    inputLevel.id = 'level'
    inputLevel.type = 'number'
    // inputLevel.value = '1'
    inputLevel.min = '1'
    inputLevel.max = '10'
    inputLevel.placeholder = 'Enter level (1-10)'
    inputLevel.addEventListener("change", changeLevel)
    levelHeading.appendChild(inputLevel)
}


function nextRank() {
    console.log("Changing current rank to next rank")
    let currentRank = localStorage.getItem('rank')
    console.log(`Current rank: ${currentRank}`)
    ranks = Object.keys(gameRanks)
    console.log(`ranks: ${ranks} type: ${typeof(ranks)}`)
    let currentRankIndex = ranks.indexOf(currentRank)
    console.log(`Index: ${typeof(currentRankIndex)}`)
    let nextRank = null
    if (currentRankIndex !== -1 && currentRankIndex < ranks.length - 1) {
        nextRank = ranks[currentRankIndex + 1]
    }
    console.log(`Next rank: ${nextRank}`)
    return nextRank
}


function updateRankLevel(rank) {
    console.log("Updating rank and level")
    const selectGame = document.getElementById('select-game')
    selectGame.value = gameRanks[rank]
    console.log(`Select game: ${selectGame.value}`)

    const level = document.getElementById('level')
    level.value = '1'
    console.log(`Level: ${level.value}`)
}


function changeRank(event = null) {
    console.log("Changing rank")
    if (event === null) {
        rank = nextRank()
        updateRankLevel(rank)
    }
    else {
        console.log('Selected Game rank:', event.target.value);
        let rank_value = event.target.value
        rank = Object.keys(gameRanks).find(key => gameRanks[key] === rank_value);
    }
    console.log(`Rank: ${rank}`)
    apiUrl = `https://twinword-word-association-quiz.p.rapidapi.com/type1/?level=1&area=${rank}`
    localStorage.setItem('rank', `${rank}`)
    console.log(`API: ${apiUrl}`)
    questionCleanup()
    populateQuestions()
}


function changeLevel(event) {
    console.log('Selected Game level:', event.target.value);
    let level = event.target.value
    let rank = localStorage.getItem('rank')
    apiUrl = `https://twinword-word-association-quiz.p.rapidapi.com/type1/?level=${level}&area=${rank}`
    console.log(`API: ${apiUrl}`)
    questionCleanup()
    populateQuestions()
}


function questionCleanup() {
    console.log("Removing question boxes")
    questionDisplay.innerHTML = ''
}


async function populateQuestions() {
    console.log(`API: ${apiUrl}`)
    let questions = await fetchData(apiUrl, options)
    console.log(`type ${typeof(questions)}`)
    console.log(`questions: ${JSON.stringify(questions, null, 2)}`);
    if (questions.result_code !== '200') {
        console.log(`result code: ${questions.result_code}`);
        changeRank()
        questions = await fetchData(apiUrl, options)
        console.log(`questions2: ${JSON.stringify(questions, null, 2)}`);
    }
    questions.quizlist.forEach(question => {
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

        question.option.forEach((option, optionIndex) => {
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
        score = score - 2
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


// Run functions when the DOM content is fully loaded
document.addEventListener("DOMContentLoaded", function () {
    populateQuestions()
    rankOptions()
    levelOptions()
});