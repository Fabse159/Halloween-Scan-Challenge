// Konfiguration: Wie viele Stationen gibt es insgesamt?
const TOTAL_STATIONS = 5;

// Wird ausgeführt, sobald die Webseite geladen ist
window.addEventListener('load', () => {
    // Lade den Spielstand oder erstelle einen neuen
    let challengeData = JSON.parse(localStorage.getItem('halloweenChallenge')) || { scannedStations: [] };
    
    const urlParams = new URLSearchParams(window.location.search);
    const currentStation = parseInt(urlParams.get('station'), 10);

    const isFirstScan = challengeData.scannedStations.length === 0;

    // Nur Anweisungen beim ersten Start aufrufen
    if (isFirstScan && !currentStation) { // Added !currentStation to prevent showing instructions if first scan is also a station scan
        showView('instructions-view');
    } else if (currentStation && !challengeData.scannedStations.includes(currentStation)) {
        // Wenn eine neue Station gescannt wurde
        challengeData.scannedStations.push(currentStation);
        localStorage.setItem('halloweenChallenge', JSON.stringify(challengeData));
        if (challengeData.scannedStations.length >= TOTAL_STATIONS) {
            showView('completion-form-view');
        } else {
            showProgressView(challengeData);
        }
    } else if (challengeData.scannedStations.length > 0) {
        // Bereits gestartet, aber noch nicht alle Stationen
        if (challengeData.scannedStations.length >= TOTAL_STATIONS) {
            showView('completion-form-view');
        } else {
            showProgressView(challengeData);
        }
    } else {
        // Falls keine Station gescannt wurde und nicht der erste Start ist
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

    // --- HIER IST DEINE BASE URL, bitte anpassen ---
    const baseUrl = 'https://fabse159.github.io/DEIN-REPO/scanner.html'; // ERSETZE DEIN-REPO

    const nameParam = encodeURIComponent(finalData.name);
    const emailParam = encodeURIComponent(finalData.email);
    const consentParam = finalData.marketingConsent;

    const urlWithData = `${baseUrl}?name=${nameParam}&email=${emailParam}&consent=${consentParam}`;

    new QRCode(qrCodeContainer, {
        text: urlWithData,
        width: 256,
        height: 256,
        colorDark : "#000000",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
    });
}
