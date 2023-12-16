// Verbindung zum WebSocket-Server herstellen
const socket = new WebSocket('ws://localhost:3000');

let ID = '';
let name = '';
let score = 0;
let roomNameList = '';
let messageList = '';
let rooms = [];
let messages = [];

/*const loginButton = document.getElementById('loginButton');
loginButton.addEventListener('click',submitForm);*/
// Event-Listener für die Verbindungsherstellung
socket.addEventListener('open', (event) => {
    console.log('Connected to WebSocket server');
    ID = sessionStorage.getItem('ID');
    console.log('ID:', ID);


    getPlayerData(ID);


    // Nachricht an den Server senden
    // socket.send('Hello, WebSocket Server!');
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

            console.log('Name ', name);
            console.log('Score ', score);

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

        if (response.action === 'startGame') {
            if(response.case) {
                window.location.href = 'memory_game.html';
            }
            else {
                alert(response.message);
            }
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

function updateRoomList() {
    const roomList = document.getElementById('roomList');

    //Clear the List
    roomList.innerHTML = '';

    rooms = roomNameList.split(', ');

    rooms.forEach(room => {
        const newRoom = document.createElement('li');
        newRoom.textContent = room;
        roomList.appendChild(newRoom);
    });
}



function getPlayerData(ID){
    const data = {
        action: 'getPlayerData',
        id: ID
    }

    socket.send(JSON.stringify(data));
}

function sendMessage() {
    const chatInput = document.getElementById('chatInput');
    const message = chatInput.value;

    if(message) {
        const data = {
            action: 'chatMessage',
            message: name + ': ' + message,
        }

        //Send chat Message
        socket.send(JSON.stringify(data));

        // Clear input field
        chatInput.value = '';
    }

}



function updateMessageList() {

    const chatMessages = document.getElementById('chatMessages');
    //Clear the List
    chatMessages.innerHTML = '';

    messages = messageList.split(',');

    messages.forEach(message => {
        const newMessage = document.createElement('div');
        newMessage.textContent = message;
        chatMessages.appendChild(newMessage);
    });
}


function addRoom() {
    const newRoomInput = document.getElementById('newRoomInput');
    const roomName = newRoomInput.value;

    if(roomName) {
        //Überprüfen (von Server) ob Room schon existiert
        const data = {
            action: 'newRoom',
            roomName: roomName,
        }

        socket.send(JSON.stringify(data));
        // Clear input field
        newRoomInput.value = '';
    }

}


/*function addRoom_toList(roomName){

    if (roomName.trim() !== '') {
        const roomList = document.getElementById('roomList');
        const newRoom = document.createElement('li');
        newRoom.textContent = roomName;

        /!*!// Löschen-Button hinzufügen
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Löschen';
        deleteButton.onclick = function() {
            deleteRoom(newRoom);
        };

        newRoom.appendChild(deleteButton);
        roomList.appendChild(newRoom);*!/
    }

}*/


function startGame() {
    const roomName = document.getElementById('startGameInput');
    const gameRoomeName = roomName.value;

    //Überprüfen, ob Raum Existiert // Noch platz frei hat
    if(gameRoomeName) {
        const data = {
            action: 'enterGame',
            gameRoom: gameRoomeName,
            userID: ID,
        }

        //Send chat Message
        socket.send(JSON.stringify(data));

        // Clear input field
        roomName.value = '';
    }
}



function navigateToGamePage() {
    // Wechseln Sie zur neuen Seite
    window.location.href = 'memory_game.html';
}


function changeTitleUsername() {

    const usernameSpan = document.getElementById('headerUser');
    const scoreSpan = document.getElementById('score');

    if (usernameSpan && scoreSpan) {
        // Change the text content of the span
        usernameSpan.innerText = 'Username: ' + name;
        scoreSpan.innerText = 'Score: ' + score;
    } else {
        console.error('Element with ID "headerUser" not found.');
    }
}


function logout() {
    sessionStorage.removeItem('ID');
    window.location.href = 'index.html';
}


//Maybe add in the end
/*function deleteRoom(roomElement) {
    const roomList = document.getElementById('roomList');
    roomList.removeChild(roomElement);
}*/