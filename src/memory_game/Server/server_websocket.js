//Imports
const Player = require('./Player');
const Room = require('./Room');


//Player Array List erstellen
let Players = []; //[]
let Rooms = []; //[]

const sockets = [];

let Messages = [];

//Add new User to Array:
let admin = new Player('Admin','1234');
Players.push(admin);

//Websocket erstellen
const WebSocket = require('ws');

// Create a WebSocket server on port 3000
const server = new WebSocket.Server({ port: 3000 });

// Event listener for connection
server.on('connection', (socket) => {
    console.log('Client connected');

    //Ad socket to broadcast list
    sockets.push(socket);


    //Damit jeder User eine aktuelle Liste hat der Räume
    socket.send(JSON.stringify({
        action: 'roomNameList',
        roomListString: roomListString(),
    }));

    socket.send(JSON.stringify({
        action: 'addMessage',
        messageListString: messageListString(),
    }));

    // Event listener for messages from clients
    socket.on('message', message => {
        console.log(`Received message: ${message}`);

        //Wenn Message nicht leer ist:
        if (message) {
            let data = JSON.parse(message);

            //Client Message: Login
            if (data.action === 'login') {
                userLogin(socket, data);
            }
            else if(data.action === 'getPlayerData') {
                sendPlayerData(socket,data);
            }

            else if(data.action === 'newRoom') {
                addRoom(socket,data);
            }

            else if(data.action === 'chatMessage') {
                addChatMessage(socket,data);
            }

            else if(data.action === 'enterGame') {
                enterGame(socket,data);
            }

            else {
            console.log('message.utf8Data is undefined');
            }}
    });



    // Event listener for disconnection
    socket.on('close', () => {
        console.log('Client disconnected');
        sockets.splice(sockets.indexOf(socket), 1);

    });
});

console.log('WebSocket server is running on port 3000');



//--------------------------FUNCTIONS GAME PAGE----------------------------------------------------
function enterGame(socket, data) {
    //Überprüfen ob Raum existiert und noch Platz frei ist
    let foundRoom = findRoomByName(data.gameRoom);
    let foundPlayer = findPlayerByID(data.userID);

    //Raum existiert und es hat noch Platz frei:
    if(foundRoom && !foundRoom.roomFull()) {
        //Spieler dem Raum zuweisen
        foundRoom.addPlayer(data.userID, socket);

        //Raum beim Spieler eintragen -> Spieler befindet sich nun in diesem Raum.
        foundPlayer.room = foundRoom.name;


        socket.send(JSON.stringify({
            action: 'startGame',
            case: true,
        }));
    }

    else {
        socket.send(JSON.stringify({
            action: 'startGame',
            case: false,
            message: 'Room does not exist (create Room!) or room is already full (max. 2 Players))',
        }));

    }

    //Send Player to Client
    socket.send(JSON.stringify({
        action: 'playerData',
        name: foundPlayer.name,
        score: foundPlayer.score,
        room: foundPlayer.room,
    }));



}




//---------------------------FUNCTIONS LOGIN & START PAGE ------------------------------------------

function userLogin(socket, data) {
    //Überprüfen ob Spieler bereits existiert.

    //Schauen, ob spieler bereits existiert.
    let foundPlayer = findPlayerByName(data.username);
    //console.log(foundPlayer);

    //FoundPlayer with Correct Password
    if(foundPlayer && foundPlayer.password===data.password) {
        console.log('playerExists_correctPW');

        //Send Player to Client
        socket.send(JSON.stringify({
            action: 'loginResponse',
            case: 'playerExists_correctPW',
            ID: foundPlayer.ID
        }));
    }

    //FoundPlayer with Incorrect Password
    else if(foundPlayer && !(foundPlayer.password===data.password)) {
        console.log('playerExists');
        //Send Case to Client -> wrong password or username already exists
        socket.send(JSON.stringify({
            action: 'loginResponse',
            case: 'playerExists',
        }));
    }

    //Couldn't found Player -> create new Player inkl. Password
    else {
        //Create new Player:
        let newPlayer = new Player(data.username,data.password);
        Players.push(newPlayer);
        console.log('createdNewPlayer ', newPlayer.name);

        //Send Player to Client
        socket.send(JSON.stringify({
            action: 'loginResponse',
            case: 'createdNewPlayer',
            ID: newPlayer.ID
        }));

    }
    console.log(Players);
}

//Find Player by Name
function findPlayerByName(name) {
    return Players.find(player => player.name === name);
}



function sendPlayerData(socket, data) {
    //Überprüfen ob Spieler bereits existiert.

    //Schauen, ob spieler bereits existiert.
    console.log(data.id);
    let foundPlayer = findPlayerByID(data.id);
    console.log('Send Userdata to', foundPlayer);

    //Send Player to Client
    socket.send(JSON.stringify({
        action: 'playerData',
        name: foundPlayer.name,
        score: foundPlayer.score,
        room: foundPlayer.room,
    }));



}

function findPlayerByID(id) {
    return Players.find(player => player.ID === id);
}



//------------------FUNCTION------------------- ROOM

function addRoom(socket, data) {
    //Schauen, ob Raum bereits existiert.
    let foundRoom = findRoomByName(data.roomName);
    //console.log(foundPlayer);

    //FoundPlayer with Correct Password
    if(foundRoom) {
        console.log('room Exists');
        //Send Player to Client
        socket.send(JSON.stringify({
            action: 'roomResponse',
            case: false,
            roomList: Rooms
        }));
    }

    //Couldn't found Room -> create new Room
    else {
        //Create new Room:
        let newRoom = new Room(data.roomName);
        Rooms.push(newRoom);
        console.log('createdNewRoom ', newRoom.name);

        broadcast(JSON.stringify({
            action: 'roomNameList',
            roomListString: roomListString(),
        }));

    }
    console.log(Rooms);
}

function addChatMessage(socket, data) {
    //Create new Room:
    let newMessage = new Room(data.message);
    Messages.push(newMessage);
    //console.log('createdNewRoom ', newRoom.name);

    broadcast(JSON.stringify({
        action: 'addMessage',
        messageListString: messageListString(),
    }));

}

function broadcast(message) {
    sockets.forEach(socket => {
        if (socket.readyState === WebSocket.OPEN) {
            socket.send(message);
        }
    });
}

function roomListString() {
    let roomNameArray = Rooms.map(obj => obj.name);
    return roomNameArray.join(', ');
}

function messageListString() {
    let messageStringArray = Messages.map(obj => obj.name);
    return messageStringArray.join(', ');
}

//Find Player by Name
function findRoomByName(name) {
    return Rooms.find(room => room.name === name);
}