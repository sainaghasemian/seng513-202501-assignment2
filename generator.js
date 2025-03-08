// Create a generator function to manage the flow of quiz questions (e.g., use `yield` to control presentation and
// user input to proceed to the next question).
// Include the logic to change the sequence based on the previous answers (e.g., difficulty adjustment).

import {Question} from './question.js';

export async function* quizGenerator(difficulty="easy") {
    // Fetching a set of questions from Open Trivia DB (https://opentdb.com/)
    const openTriviaUrl = `https://opentdb.com/api.php?amount=5&difficulty=${difficulty}&type=multiple`;

    try {
        const response = await fetch(openTriviaUrl);
        const data = await response.json();
    
        const questions = data.results.map(q => 
            new Question(q.question, [...q.incorrect_answers, q.correct_answer].sort(), q.correct_answer, difficulty)
        );

        // Yield each question
        for (const question of questions) {
            yield question;
        }
    }
    catch (error) {
        console.error("Error fetching questions:", error);
    }
}