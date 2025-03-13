import { quizGenerator } from './generator.js';
import { Quiz } from './quiz.js';
import { User } from './user.js';

let quiz = new Quiz();
let generator;
let user;

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("start-btn").addEventListener("click", startQuiz);
});

async function startQuiz() {
    const usernameInput = document.getElementById("username").value.trim();
    if (!usernameInput) {
        alert("Please enter your username to begin quiz.");
        return;
    }

    user = new User(usernameInput);

    await loadQuestions();

    document.getElementById("name-screen").style.display = "none";
    document.getElementById("quiz-container").style.display = "block";

    while (true) {
        for await (const question of generator) {
            // Handle each question here
            document.getElementById("question-text").innerHTML = question.text;
            document.getElementById("choices").innerHTML = question.choices.map((choice, index) =>
                `
                <input type="radio" name="choice" value="${choice}" id="choice${index}">
                <label for="choice${index}">${choice}</label>
                <br>
                `
            ).join("");
            console.log(question);

            await new Promise((resolve) => {
                document.getElementById("submit-btn").addEventListener("click", function onClick() {
                    const selectedChoice = document.querySelector('input[name="choice"]:checked');
                    if (!selectedChoice) {
                        alert("Please select an answer to continue.");
                        return;
                    }
                    quiz.answerScores(question, selectedChoice.value);
                    document.getElementById("score").innerHTML = `Score: ${quiz.score}`;
                    document.getElementById("submit-btn").removeEventListener("click", onClick);
                    resolve();
                });
            });

            // Check if the difficulty has changed and reload questions if needed
            if (quiz.answersCorrect === 2 || quiz.answersCorrect === 4 || (quiz.difficulty === "hard" && (quiz.answersCorrect - 4) % 5 === 0) || quiz.answersIncorrect === 1) {
                await loadQuestions();
                break;
            }
        }
    }
}

async function loadQuestions() {
    generator = quizGenerator(quiz.difficulty);
}