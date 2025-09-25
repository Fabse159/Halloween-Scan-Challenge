// Konfiguration: Wie viele Stationen gibt es insgesamt?
const TOTAL_STATIONS = 5;

// Wird ausgeführt, sobald die Webseite geladen ist
window.addEventListener('load', () => {
    // Lade den Spielstand oder erstelle einen neuen
    let challengeData = JSON.parse(localStorage.getItem('halloweenChallenge')) || { scannedStations: [] };
    
    const urlParams = new URLSearchParams(window.location.search);
    const currentStation = parseInt(urlParams.get('station'), 10);

    const isFirstScan = challengeData.scannedStations.length === 0;

    // A. Allerster Scan überhaupt: Anleitung anzeigen
    if (isFirstScan && currentStation) {
        showView('instructions-view');
    }

    // B. Eine gültige Station wurde gescannt: Fortschritt aktualisieren
    if (currentStation && !challengeData.scannedStations.includes(currentStation)) {
        challengeData.scannedStations.push(currentStation);
        localStorage.setItem('halloweenChallenge', JSON.stringify(challengeData));
    }

    // C. Prüfen, ob das Spiel läuft (mind. 1 Station gescannt)
    if (challengeData.scannedStations.length > 0) {
        // C1. Prüfen, ob alle Stationen gescannt wurden
        if (challengeData.scannedStations.length >= TOTAL_STATIONS) {
            showView('completion-form-view'); // Zeige das Abschluss-Formular
        } else {
            // C2. Noch nicht fertig -> Zeige den Fortschritt
            showProgressView(challengeData);
        }
    } else {
        // D. Wenn die Seite ohne ?station=... aufgerufen wird und noch nichts gescannt wurde
        showView('instructions-view');
        document.querySelector('#instructions-view p').textContent = "Bitte scanne den QR-Code an einer beliebigen Station, um zu beginnen!";
    }
});

// Event Listener für das finale Formular
document.getElementById('completion-form').addEventListener('submit', (event) => {
    event.preventDefault(); // Verhindert, dass die Seite neu lädt

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const privacyConsent = document.getElementById('privacy-consent').checked;
    const marketingConsent = document.getElementById('marketing-consent').checked;


    if (name && email && privacyConsent) {
        const finalData = { name, email, marketingConsent };
        showFinalQrCodeView(finalData);
    } else {
        alert('Bitte fülle alle Felder aus und stimme den Bedingungen zu, um fortzufahren.');
    }
});

// --- Hilfsfunktionen zum Anzeigen der verschiedenen Bereiche ---

function showView(viewId) {
    document.querySelectorAll('.view').forEach(view => view.style.display = 'none');
    document.getElementById(viewId).style.display = 'block';
}

function showProgressView(challengeData) {
    showView('progress-view');
    
    const stationsList = document.getElementById('stations-list');
    stationsList.innerHTML = ''; // Leere die alte Liste

    for (let i = 1; i <= TOTAL_STATIONS; i++) {
        const isScanned = challengeData.scannedStations.includes(i);
        const stationDiv = document.createElement('div');
        stationDiv.className = 'station' + (isScanned ? ' scanned' : '');
        stationDiv.textContent = `Station ${i}: ${isScanned ? '✔️ Gefunden' : '❌ Offen'}`;
        stationsList.appendChild(stationDiv);
    }
}

function showFinalQrCodeView(finalData) {
    showView('final-qrcode-view');
    
    const qrCodeContainer = document.getElementById('final-qrcode');
    qrCodeContainer.innerHTML = ''; 

    const qrCodeData = JSON.stringify(finalData);

    new QRCode(qrCodeContainer, {
        text: qrCodeData,
        width: 256,
        height: 256
    });
}
