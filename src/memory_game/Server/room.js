class Room {

    constructor(name) {
        this.name = name;
        // User Information
        this.players = [];
        this.numberOfPlayers = 0;
        this.maxPlayers = 2;
        this.sockets =  [];
    }

    // Method to display the player's information
    displayInfo() {
        console.log(`Name: ${this.name}, NumberOfPlayers: ${this.players}`);
    }



    // Method to increase the player's score
    addPlayer(ID, socket) {
        this.players.push(ID)
        this.numberOfPlayers += 1;
        console.log(`Player added, Players in the Room: ${this.players}`);
        this.sockets.push(socket);
    }

    removePlayer(ID) {
        this.players = this.players.filter(playerID => playerID !== ID);
        this.numberOfPlayers -= 1;
        console.log(`Player removed, Players in the Room: ${this.players}`);
        this.sockets.splice(this.sockets.indexOf(socket), 1);
    }

    roomFull() {
        return this.players.length === this.maxPlayers;
    }
}

module.exports = Room;


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
