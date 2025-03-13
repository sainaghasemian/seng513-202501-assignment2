// Create a generator function to manage the flow of quiz questions (e.g., use `yield` to control presentation and
// user input to proceed to the next question).
// Include the logic to change the sequence based on the previous answers (e.g., difficulty adjustment).

import { Question } from './question.js';

export async function* quizGenerator(difficulty = "easy") {
    const openTriviaUrl = `https://opentdb.com/api.php?amount=5&difficulty=${difficulty}&type=multiple`;

    while (true) {
        try {
            const response = await fetch(openTriviaUrl);
            if (response.status === 429) {
                console.warn("Too many requests. Waiting for 2 seconds before retrying...");
                await new Promise(resolve => setTimeout(resolve, 2000));
                continue; // Retry the request
            }

            const data = await response.json();
            const questions = data.results.map(q =>
                new Question(q.question, [...q.incorrect_answers, q.correct_answer].sort(), q.correct_answer, difficulty)
            );

            for (const question of questions) {
                yield question;
            }
            break; // Exit the loop after successfully yielding questions
        } catch (error) {
            console.error("Error fetching questions:", error);
            break; // Exit the loop if an error occurs
        }
    }
}