// Konfiguration: 7 Stationen mit neuen Namen
const TOTAL_STATIONS = 7;
const STATION_NAMES = {
    1: "Foltershow",
    2: "Pfad der Albträume",
    3: "Zombiezone",
    4: "Hexenwald & Wolfsrevier",
    5: "Blutfarm & Kornfeld",
    6: "Sanatorium & Hochsicherheitstrakt",
    7: "Clownzirkus"
};

document.addEventListener('DOMContentLoaded', () => {
    // UI-Elemente
    const instructionsModal = document.getElementById('instructions-modal');
    const closeInstructionsBtn = document.getElementById('close-instructions-btn');
    const showInstructionsBtn = document.getElementById('show-instructions-btn');

    // Lade den Spielstand oder erstelle einen neuen
    let challengeData = JSON.parse(localStorage.getItem('halloweenChallenge')) || { scannedStations: [] };
    
    const urlParams = new URLSearchParams(window.location.search);
    const currentStation = parseInt(urlParams.get('station'), 10);

    const isFirstScan = challengeData.scannedStations.length === 0;

    // Eine gültige, neue Station wurde gescannt
    if (currentStation && !challengeData.scannedStations.includes(currentStation)) {
        // Beim allerersten Scan die Anleitung als Pop-up zeigen
        if (isFirstScan) {
            instructionsModal.style.display = 'flex';
        }
        challengeData.scannedStations.push(currentStation);
        localStorage.setItem('halloweenChallenge', JSON.stringify(challengeData));
    }

    // Entscheiden, welche Haupt-Ansicht gezeigt wird
    if (challengeData.scannedStations.length >= TOTAL_STATIONS) {
        showView('completion-form-view');
    } else {
        // In allen anderen Fällen die Fortschrittsanzeige zeigen
        showView('progress-view');
        showProgressViewContent(challengeData);
    }
    
    // Steuerungs-Button für die Anleitung nur anzeigen, wenn das Spiel läuft
    if (challengeData.scannedStations.length > 0) {
        showInstructionsBtn.style.display = 'block';
    }

    // Event Listeners für die Anleitung
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
        stationsList.innerHTML = '<p>Noch keine Station gescannt. Finde den ersten QR-Code!</p>';
    } else {
        for (let i = 1; i <= TOTAL_STATIONS; i++) {
            const isScanned = challengeData.scannedStations.includes(i);
            const stationDiv = document.createElement('div');
            stationDiv.className = 'station' + (isScanned ? ' scanned' : '');
            stationDiv.textContent = STATION_NAMES[i];
            stationsList.appendChild(stationDiv);
        }
    }
}

function showFinalQrCodeView(finalData) {
    showView('final-qrcode-view');
    const qrCodeContainer = document.getElementById('final-qrcode');
    qrCodeContainer.innerHTML = ''; 

    // WICHTIG: Ersetze diese URL mit dem korrekten Link zu deiner scanner.html
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
