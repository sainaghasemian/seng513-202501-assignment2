import {quizGenerator} from './generator.js';
import {Quiz} from './quiz.js';
import {User} from './user.js';

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

    generator = quizGenerator(quiz.difficulty);
    document.getElementById("name-screen").style.display = "none";
    document.getElementById("quiz-container").style.display = "block";
    
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
        // You can display the question to the user and wait for their response before continuing
    }
}
