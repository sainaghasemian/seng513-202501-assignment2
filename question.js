// Question: Represents a single quiz question, including the text, choices, and the correct answer.
export class Question {
    constructor(text, choices, correctAnswer, difficulty) {
        this.text = text;
        this.choices = choices;
        this.correctAnswer = correctAnswer;
        this.difficulty = difficulty;
    }
}