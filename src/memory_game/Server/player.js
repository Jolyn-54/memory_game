class Player {

    constructor(name, password) {
        //Creating unique ID -> also used for session storage
        this.ID = this.generateRandomId();
        // User Information
        this.name = name;
        this.password = password;
        this.score = 0;
        this.gameScore = 0;
        this.room = '';
    }

    // Method to display the player's information
    displayInfo() {
        console.log(`Player ID: ${this.ID}, Name: ${this.name}, Score: ${this.score}`);
    }

    resetRoomName(name){
        this.room = '';
    }

    // Method to increase the player's score
    increaseScore(points) {
        this.score += points;
        console.log(`${this.name}'s score increased by ${points}. New score: ${this.score}`);
    }

    increaseGameScore(points) {
        this.gameScore += points;
        console.log(`${this.name}'s gameScore increased by ${points}. New score: ${this.score}`);
    }

    // Method to reset the player's score
    resetGameScore() {
        this.gameScore = 0;
        console.log(`${this.name}'s gameScore has been reset to 0.`);
    }

    generateRandomId() {
        const timestamp = Date.now().toString(36);
        const randomString = Math.random().toString(36).substr(2, 5);
        return timestamp + randomString;
    }
}

module.exports = Player;


/*
// Example usage:
const player1 = new Player('Alice', 50);
const player2 = new Player('Bob');

player1.displayInfo(); // Output: Player: Alice, Score: 50
player2.displayInfo(); // Output: Player: Bob, Score: 0

player1.increaseScore(10); // Output: Alice's score increased by 10. New score: 60
player2.resetScore(); // Output: Bob's score has been reset to 0

player1.displayInfo(); // Output: Player: Alice, Score: 60
player2.displayInfo(); // Output: Player: Bob, Score: 0
*/
