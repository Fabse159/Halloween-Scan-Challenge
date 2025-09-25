// Konfiguration: Wie viele Stationen gibt es insgesamt?
const TOTAL_STATIONS = 5;

// Wird ausgeführt, sobald die Webseite geladen ist
window.addEventListener('load', () => {
    // Lade den Spielstand oder erstelle einen neuen
    let challengeData = JSON.parse(localStorage.getItem('halloweenChallenge')) || { scannedStations: [] };
    
    const urlParams = new URLSearchParams(window.location.search);
    const currentStation = parseInt(urlParams.get('station'), 10);

    const isFirstScan = challengeData.scannedStations.length === 0;

    if (isFirstScan && currentStation) {
        showView('instructions-view');
    }

    if (currentStation && !challengeData.scannedStations.includes(currentStation)) {
        challengeData.scannedStations.push(currentStation);
        localStorage.setItem('halloweenChallenge', JSON.stringify(challengeData));
    }

    if (challengeData.scannedStations.length > 0) {
        if (challengeData.scannedStations.length >= TOTAL_STATIONS) {
            showView('completion-form-view');
        } else {
            showProgressView(challengeData);
        }
    } else {
        showView('instructions-view');
        document.querySelector('#instructions-view p').textContent = "Bitte scanne den QR-Code an einer beliebigen Station, um zu beginnen!";
    }
});

document.getElementById('completion-form').addEventListener('submit', (event) => {
    event.preventDefault(); 

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const privacyConsent = document.getElementById('privacy-consent').checked;
    const marketingConsent = document.getElementById('marketing-consent').checked;

    if (name && email && privacyConsent) {
        const finalData = { name, email, marketingConsent };
        showFinalQrCodeView(finalData);
    } else {
        alert('Bitte fülle die Pflichtfelder aus und stimme der Datenschutzerklärung zu.');
    }
});

function showView(viewId) {
    document.querySelectorAll('.view').forEach(view => view.style.display = 'none');
    document.getElementById(viewId).style.display = 'block';
}

function showProgressView(challengeData) {
    showView('progress-view');
    
    const stationsList = document.getElementById('stations-list');
    stationsList.innerHTML = '';

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

    // --- HIER IST DIE WICHTIGE ÄNDERUNG ---
    // Ersetze diese URL mit dem Link zu deiner scanner.html
    const baseUrl = 'https://fabse159.github.io/Halloween-Scan-Challenge/scanner.html';

    // Daten für die URL sicher kodieren
    const nameParam = encodeURIComponent(finalData.name);
    const emailParam = encodeURIComponent(finalData.email);
    const consentParam = finalData.marketingConsent; // true/false muss nicht kodiert werden

    // Die finale URL mit den Daten zusammenbauen
    const urlWithData = `${baseUrl}?name=${nameParam}&email=${emailParam}&consent=${consentParam}`;

    // Erzeuge den QR-Code aus der URL
    new QRCode(qrCodeContainer, {
        text: urlWithData,
        width: 256,
        height: 256
    });
}
