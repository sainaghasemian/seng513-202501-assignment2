// Quiz Class: Manages the overall quiz operations like starting the quiz, keeping score, and determining the next question.
export class Quiz {
    constructor() {
        this.score = 0;
        this.answersIncorrect = 0;
        this.answersCorrect = 0;
        this.difficulty = "easy";
    }

    answerScores(question, inputAnswer) {
        if (inputAnswer == question.correctAnswer) {
            this.score++;
            this.answersCorrect++;
            this.answersIncorrect=0;
        }
        else {
            this.answersIncorrect++;
            this.answersCorrect = 0;
        }

        // Changing the difficulty based on how many correct answers have been gotten
        if (this.answersCorrect >= 4) {
            this.difficulty = "hard";
        }
        else if (this.answersCorrect >= 2) {
            this.difficulty = "medium"
        }
        else {
            this.difficulty = "easy"
        }
    }    
}