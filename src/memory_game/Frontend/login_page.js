// Verbindung zum WebSocket-Server herstellen
const socket = new WebSocket('ws://localhost:3000');

const loginButton = document.getElementById('loginButton');
loginButton.addEventListener('click',submitForm);
// Event-Listener für die Verbindungsherstellung
socket.addEventListener('open', (event) => {
    console.log('Connected to WebSocket server');

    // Nachricht an den Server senden
    // socket.send('Hello, WebSocket Server!');
});

// Event-Listener für eingehende Nachrichten vom Server
socket.addEventListener('message', (event) => {
    console.log(`Received message from server: ${event.data}`);

    try {
        const response = JSON.parse(event.data);

        if (response.action === 'loginResponse') {
            if (response.case === 'playerExists_correctPW') {
                console.log('playerExists_correctPW')

                //"Login credentials abspeichern im Session storage vom Spieler.

                sessionStorage.setItem('ID',response.ID);
                console.log(response.ID);

                navigateToStartPage();
            }

            if (response.case === 'playerExists') {
                console.log('playerExists')
                alert('username already exists or wrong password')
            }

            if (response.case === 'createdNewPlayer') {
                console.log('createdNewPlayer');
                sessionStorage.setItem('ID',response.ID);
                console.log(response.ID);


                navigateToStartPage();
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



// Funktion zum Absenden des Formulars
function submitForm() {
    // Benutzerdaten abrufen
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    console.log('Button pressed');

    // Überprüfen, ob Benutzername und Passwort vorhanden sind
    if (username && password) {
        //JSON-Objekt erstellen und an server senden
        const data = {
            action: 'login',
            username: username,
            password: password
        };

        // Daten über die WebSocket-Verbindung senden
        socket.send(JSON.stringify(data));

    } else {
        alert('Bitte geben Sie Benutzername und Passwort ein.');
    }
}

// Auf eine andere Seite wechseln
function navigateToStartPage() {
    // Wechseln Sie zur neuen Seite
    window.location.href = 'start_page.html';
}


