// Konfiguration: Jede Station hat eine einzigartige ID und einen neuen Namen.
const STATIONS = [
    { id: '4821', name: 'Folterplatz' },
    { id: '1903', name: 'Tunnel der Ängste' },
    { id: '7356', name: 'Zombiezone' },
    { id: '9210', name: 'Dark Forest' },
    { id: '3488', name: 'Cornfield' },
    { id: '6675', name: 'Anstalt X' },
    { id: '8102', name: 'Clowntown' }
];
const TOTAL_STATIONS = STATIONS.length;

document.addEventListener('DOMContentLoaded', () => {
    // UI-Elemente
    const instructionsModal = document.getElementById('instructions-modal');
    const closeInstructionsBtn = document.getElementById('close-instructions-btn');
    const showInstructionsBtn = document.getElementById('show-instructions-btn');

    // Lade den Spielstand oder erstelle einen neuen
    let challengeData = JSON.parse(localStorage.getItem('halloweenChallenge')) || { scannedStations: [] };
    
    const urlParams = new URLSearchParams(window.location.search);
    // Wir lesen die ID als Text, nicht mehr als Zahl
    const currentStationId = urlParams.get('station');

    const isFirstScan = challengeData.scannedStations.length === 0;

    // Nur Anweisungen anzeigen, wenn die Seite ohne Stations-Parameter aufgerufen wird
    if (isFirstScan && !currentStationId) {
        showView('instructions-view');
        return; 
    }
    
    // Eine gültige, neue Station wurde gescannt
    if (currentStationId && !challengeData.scannedStations.includes(currentStationId)) {
        // Prüfen, ob die gescannte ID überhaupt existiert
        if (STATIONS.some(s => s.id === currentStationId)) {
            if (isFirstScan) {
                instructionsModal.style.display = 'flex';
            }
            challengeData.scannedStations.push(currentStationId);
            localStorage.setItem('halloweenChallenge', JSON.stringify(challengeData));
        }
    }

    // Entscheiden, welche Haupt-Ansicht gezeigt wird
    if (challengeData.scannedStations.length >= TOTAL_STATIONS) {
        showView('completion-form-view');
    } else {
        showView('progress-view');
        showProgressViewContent(challengeData);
    }
    
    if (challengeData.scannedStations.length > 0) {
        showInstructionsBtn.style.display = 'block';
    }

    closeInstructionsBtn.addEventListener('click', () => {
        instructionsModal.style.display = 'none';
    });
    showInstructionsBtn.addEventListener('click', () => {
        instructionsModal.style.display = 'flex';
    });
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
    document.querySelectorAll('main > .view').forEach(view => view.style.display = 'none');
    document.getElementById(viewId).style.display = 'block';
}

function showProgressViewContent(challengeData) {
    const stationsList = document.getElementById('stations-list');
    stationsList.innerHTML = '';
    
    if (challengeData.scannedStations.length === 0) {
        stationsList.innerHTML = '<p style="padding: 0 20px;">Noch keine Station gescannt. Finde den ersten QR-Code!</p>';
    } else {
        // Schleife über die neue STATIONS-Liste
        STATIONS.forEach(station => {
            const isScanned = challengeData.scannedStations.includes(station.id);
            const stationDiv = document.createElement('div');
            stationDiv.className = 'station' + (isScanned ? ' scanned' : '');
            stationDiv.textContent = station.name;
            stationsList.appendChild(stationDiv);
        });
    }
}

function showFinalQrCodeView(finalData) {
    showView('final-qrcode-view');
    const qrCodeContainer = document.getElementById('final-qrcode');
    qrCodeContainer.innerHTML = ''; 

    // Die URL zu deinem Datensammler
    const baseUrl = 'https://fabse159.github.io/Halloween-Scan-Challenge/scanner.html'; 

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
