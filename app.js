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

// Wird ausgeführt, sobald die Webseite geladen ist
window.addEventListener('load', () => {
    let challengeData = JSON.parse(localStorage.getItem('halloweenChallenge')) || { scannedStations: [] };
    
    const urlParams = new URLSearchParams(window.location.search);
    const currentStation = parseInt(urlParams.get('station'), 10);

    const isFirstScan = challengeData.scannedStations.length === 0;

    // Nur Anweisungen anzeigen, wenn die Seite ohne Stations-Parameter aufgerufen wird
    if (isFirstScan && !currentStation) {
        showView('instructions-view');
        return; // Frühzeitiger Abbruch, um weitere Logik zu verhindern
    }
    
    // Eine gültige Station wurde gescannt
    if (currentStation && !challengeData.scannedStations.includes(currentStation)) {
        challengeData.scannedStations.push(currentStation);
        localStorage.setItem('halloweenChallenge', JSON.stringify(challengeData));
    }

    // Entscheiden, welche Ansicht gezeigt wird
    if (challengeData.scannedStations.length >= TOTAL_STATIONS) {
        showView('completion-form-view');
    } else if (challengeData.scannedStations.length > 0) {
        showProgressView(challengeData);
    } else {
        // Fallback, falls jemand die Seite ohne Aktion lädt
        showView('instructions-view');
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
        stationDiv.textContent = STATION_NAMES[i]; // Benutze die neuen Stationsnamen
        stationsList.appendChild(stationDiv);
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
