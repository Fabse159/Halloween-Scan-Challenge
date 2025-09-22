// Konfiguration: Wie viele Stationen gibt es insgesamt?
const TOTAL_STATIONS = 5;

// Diese Funktion wird ausgeführt, sobald die Webseite geladen ist
window.addEventListener('load', () => {
    
    // 1. Daten aus dem Local Storage abrufen
    const userData = JSON.parse(localStorage.getItem('challengeUser'));
    
    // 2. Die Stationsnummer aus der URL auslesen (z.B. "?station=2")
    const urlParams = new URLSearchParams(window.location.search);
    const currentStation = parseInt(urlParams.get('station'), 10);

    // 3. Logik: Was soll angezeigt werden?
    if (!userData) {
        // Fall A: Kein Nutzer gespeichert
        if (currentStation === 1) {
            // Wenn bei Station 1, zeige Registrierung
            showView('registration-view');
        } else {
            // Sonst Hinweis geben, dass man erst Station 1 scannen muss
            alert('Bitte scanne zuerst den QR-Code von Station 1, um zu starten!');
        }
    } else {
        // Fall B: Nutzer ist bereits registriert
        if (currentStation && !userData.scannedStations.includes(currentStation)) {
            // Neue, ungescannte Station -> zur Liste hinzufügen
            userData.scannedStations.push(currentStation);
            localStorage.setItem('challengeUser', JSON.stringify(userData)); // Speichern!
        }
        
        // Prüfen, ob alle Stationen gescannt wurden
        if (userData.scannedStations.length >= TOTAL_STATIONS) {
            // Ja, alle geschafft -> Zeige Abschluss-Bildschirm
            showCompletionView(userData);
        } else {
            // Nein, noch nicht fertig -> Zeige Fortschritt
            showProgressView(userData);
        }
    }
});

// Event Listener für das Registrierungs-Formular
document.getElementById('registration-form').addEventListener('submit', (event) => {
    event.preventDefault(); // Verhindert, dass die Seite neu lädt

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;

    // Erstelle das Nutzer-Objekt
    const userData = {
        name: name,
        email: email,
        scannedStations: [1] // Station 1 ist mit der Registrierung erledigt
    };

    // Speichere das Objekt als Text im Local Storage
    localStorage.setItem('challengeUser', JSON.stringify(userData));

    // Zeige die Fortschrittsanzeige
    showProgressView(userData);
});


// --- Hilfsfunktionen zum Anzeigen der verschiedenen Bereiche ---

function showView(viewId) {
    // Verstecke alle Ansichten
    document.querySelectorAll('.view').forEach(view => view.style.display = 'none');
    // Zeige die gewünschte Ansicht
    document.getElementById(viewId).style.display = 'block';
}

function showProgressView(userData) {
    showView('progress-view');
    document.getElementById('welcome-message').textContent = `Hallo, ${userData.name}!`;
    
    const stationsList = document.getElementById('stations-list');
    stationsList.innerHTML = ''; // Leere die alte Liste

    for (let i = 1; i <= TOTAL_STATIONS; i++) {
        const isScanned = userData.scannedStations.includes(i);
        const stationDiv = document.createElement('div');
        stationDiv.className = 'station' + (isScanned ? ' scanned' : '');
        stationDiv.textContent = `Station ${i}: ${isScanned ? '✔️ Besucht' : '❌ Offen'}`;
        stationsList.appendChild(stationDiv);
    }
}

function showCompletionView(userData) {
    showView('completion-view');
    
    const qrCodeContainer = document.getElementById('final-qrcode');
    qrCodeContainer.innerHTML = ''; // Leere den Container, falls schon ein QR-Code da ist

    // Erstelle einen Text (JSON-Format), der die Nutzerdaten enthält
    const qrCodeData = JSON.stringify({
        name: userData.name,
        email: userData.email
    });

    // Generiere den QR-Code mit der externen Bibliothek
    new QRCode(qrCodeContainer, {
        text: qrCodeData,
        width: 256,
        height: 256
    });
}
