// User: Represents a user taking the quiz and could include properties like username and score history.
export class User {
    constructor(username) {
        this.username = username;
        this.scoreHistory = [];
    }

    updateScore(quizScore) {
        this.scoreHistory.push(quizScore);
    }
    
}