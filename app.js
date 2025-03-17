import { quizGenerator } from './generator.js';
import { Quiz } from './quiz.js';
import { User } from './user.js';

let quiz = new Quiz();
let generator;
let user;

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("start-btn").addEventListener("click", initializeUser);
});

async function startQuiz() {
    

    await loadQuestions();

    document.getElementById("name-screen").style.display = "none";
    document.getElementById("quiz-container").style.display = "block";

    while (true) {
        for await (const question of generator) {
            // Handle each question here
            document.getElementById("question-text").innerHTML = question.text;
            document.getElementById("question-number").innerText = `Question: ${quiz.questionNumber}`;
            document.getElementById("question-difficulty").innerText = `Difficulty: ${quiz.difficulty}`;
            document.getElementById("score").innerText = `Score: ${quiz.score}`;
            document.getElementById("choices").innerHTML = question.choices.map((choice, index) =>
                `
                <input type="radio" name="choice" value="${choice}" id="choice${index}">
                <label for="choice${index}">${choice}</label>
                <br>
                `
            ).join("");
            console.log.call(console, question);

            await new Promise((resolve) => {
                document.getElementById("submit-btn").addEventListener("click", function onClick() {
                    const selectedChoice = document.querySelector('input[name="choice"]:checked');
                    if (!selectedChoice) {
                        alert("Please select an answer to continue.");
                        return;
                    }
            
                    const isCorrect = selectedChoice.value === question.correctAnswer;
            
                    quiz.answerScores(question, selectedChoice.value);
                    document.getElementById("score").innerHTML = `Score: ${quiz.score}`;
                    document.getElementById("question-number").innerText = `Question: ${quiz.questionNumber}`;
                    document.getElementById("question-difficulty").innerText = `Difficulty: ${quiz.difficulty}`;
            
                    document.getElementById("submit-btn").removeEventListener("click", onClick);
            
                    const quizContainer = document.getElementById("quiz-container");
            
                    if (!isCorrect) {
                        let feedbackEl = document.getElementById("feedback");
                        if (!feedbackEl) {
                            feedbackEl = document.createElement("div");
                            feedbackEl.id = "feedback";
                            document.getElementById("quiz-container").appendChild(feedbackEl);
                        }
                        feedbackEl.innerHTML = `Wrong! The correct answer is: ${question.correctAnswer}`;
            
                        quizContainer.classList.add("wrong-animation");
            
                        setTimeout(() => {
                            quizContainer.classList.remove("wrong-animation");
                            feedbackEl.innerHTML = "";
                            resolve();
                        }, 2000);
                    } else {
                        quizContainer.classList.add("correct-animation");
            
                        setTimeout(() => {
                            quizContainer.classList.remove("correct-animation");
                            resolve();
                        }, 2000); 
                    }
                });
            });
            
            
            
            
            

            // Check if the difficulty has changed and reload questions if needed
            if (quiz.answersCorrect === 2 || quiz.answersCorrect === 4 || (quiz.difficulty === "hard" && (quiz.answersCorrect - 4) % 5 === 0) || quiz.answersIncorrect === 1) {
                await loadQuestions();
                break;
            }

            // Check if the user has 3 consecutive incorrect answers
            if (quiz.answersIncorrect === 3) {
                showQuizEndScreen();
                return;
            }
        }
    }
}

async function loadQuestions() {
    generator = quizGenerator(quiz.difficulty);
}

function showQuizEndScreen() {
    document.getElementById("quiz-container").style.display = "none";
    document.getElementById("quiz-end-container").style.display = "block";
    document.getElementById("final-score").innerText = quiz.score;
    user.updateScore(quiz.score);

    document.getElementById('score-history-btn').addEventListener('click', function () {
        const scoreHistory = document.getElementById('score-history');
        scoreHistory.style.display = 'block'; // Show the score history container
        this.style.display = 'none'; // Hide the score history button
        const userhistory = document.getElementById('user-history-name');
        userhistory.innerHTML = `Previous Scores for ${user.username}:`;
        // Display the score history or a placeholder message if no scores exist
        const scores = user.scoreHistory;
        if (scores.length > 0) {
            let listHTML = '<ul>';
            scores.forEach((score, index) => {
                listHTML += `<li>Quiz ${index + 1}: <strong>${score}</strong></li>`;
            });
            listHTML += '</ul>';
            scoreHistory.innerHTML = listHTML;
        } else {
            scoreHistory.innerHTML = '<p>No previous quiz scores.</p>';
        }
    });
    

    // Handle the restart quiz button click event
    document.getElementById('restart-btn').addEventListener('click', function () {
        restartQuiz(user);
    });
}

function restartQuiz(user) {
    document.getElementById('name-screen').style.display = 'none';
    document.getElementById('quiz-end-container').style.display = 'none';
    document.getElementById('quiz-container').style.display = 'block';
    document.getElementById('score-history-btn').style.display = 'block';
    document.getElementById('score-history').style.display = 'none';
    document.getElementById("score").innerHTML = `Score: 0`;
    const choicesForm = document.getElementById('choices');
    choicesForm.innerHTML = '';
    const question = document.getElementById('question-text');
    question.innerHTML = '';

    quiz = new Quiz();
    startQuiz(user);
}

function initializeUser() {
    const usernameInput = document.getElementById("username").value.trim();
    if (!usernameInput) {
        alert("Please enter your username to begin quiz.");
        return;
    }

    user = new User(usernameInput);
    startQuiz();
}