import {quizGenerator} from './generator.js';
import {Quiz} from './quiz.js';
import {User} from './user.js';

let quiz = new Quiz();
let generator;
let username;

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("start-btn").addEventListener("click", startQuiz);
});

async function startQuiz() {
    const usernameInput = document.getElementById("username").value.trim();
    if (!usernameInput) {
        alert("Please enter your username to begin quiz.");
        return;
    }
}
