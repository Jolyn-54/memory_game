// Verbindung zum WebSocket-Server herstellen
const socket = new WebSocket('ws://localhost:3000');

let ID = '';
let name = '';
let score = 0;
let roomNameList = '';
let messageList = '';
let rooms = [];
let messages = [];
let room = '';
let numberOfPlayers = 0;

// Event-Listener für die Verbindungsherstellung
socket.addEventListener('open', (event) => {
    console.log('Connected to WebSocket server');
    ID = sessionStorage.getItem('ID');
    console.log('ID:', ID);


    getPlayerData(ID);

});

// Event-Listener für eingehende Nachrichten vom Server
socket.addEventListener('message', (event) => {
    console.log(`Received message from server: ${event.data}`);

    try {
        const response = JSON.parse(event.data);

        if (response.action === 'playerData') {
            console.log('Get Player data');

            name = response.name;
            score = response.score;
            room = response.room;

            changeTitleUsername();
        }

        if (response.action === 'roomNameList') {
            roomNameList = response.roomListString;
            //console.log('roomList:', response.roomListString);
            updateRoomList();
        }

        if (response.action === 'addMessage') {
            messageList = response.messageListString;
            //console.log('roomList:', response.roomListString);
            updateMessageList();
        }



    } catch (error) {
        console.error('Error parsing JSON:', error);
    }
});

// Event-Listener für die Schließung der Verbindung
socket.addEventListener('close', (event) => {
    console.log('Connection to WebSocket server closed');
});


//----------------------------------------------FUNCTIONS--------------------------------------------------------------

function getPlayerData(ID){
    const data = {
        action: 'getPlayerData',
        id: ID
    }

    socket.send(JSON.stringify(data));
}

function changeTitleUsername() {

    const usernameSpan = document.getElementById('headerUser');
    const scoreSpan = document.getElementById('score');
    const roomSpan = document.getElementById('headerRoom')

    if (usernameSpan && scoreSpan) {
        // Change the text content of the span
        usernameSpan.innerText = 'Username: ' + name;
        scoreSpan.innerText = 'Score: ' + score;
        roomSpan.innerText = 'Room Name: ' + room;
    } else {
        console.error('Element with ID "headerUser" not found.');
    }
}

function startGame() {
    // Add logic to start the game
    alert('Game started!');
}

function goBack() {
    alert('Go back to Startpage!');

    //TODO: Gegner erhält automatisch einen Punkt


    window.location.href = 'start_page.html';
}

