const STORAGE_TOKEN = 'YDITW3FZPTKXOANID4RLEPARCUN9OMMKIJBM9WO8';
const STORAGE_URL = 'https://remote-storage.developerakademie.org/item';

/**
 * Object to store the active user's information.
 * @type {Object}
 */
let activUser = {
    'name': '',
};

let users = [];

async function setItem(key, value) {
    const payload = { key, value, token: STORAGE_TOKEN };
    return fetch(STORAGE_URL, { method: 'POST', body: JSON.stringify(payload) })
        .then(res => res.json());
}

async function getItem(key) {
    const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
    return fetch(url).then(res => res.json()).then(res => {
        // Verbesserter code
        if (res.data) {
            return res.data.value;
        } throw `Could not find data with key "${key}".`;
    });
}

function initSummary() {
    loadActiveUser();
    displayUserName();
}

//Load active User from localStorage
function loadActiveUser() {
    // Laden Sie den aktivierten Benutzer aus localStorage, falls vorhanden
    const activUserJSON = localStorage.getItem('activUser');

    if (activUserJSON) {
        activUser = JSON.parse(activUserJSON);
        // Ändere 'name' in 'userName' oder einen anderen geeigneten Bezeichner
        userName = activUser.name;
    } else {
        // Der Benutzer ist nicht angemeldet oder die Information wurde gelöscht
        // Führen Sie entsprechende Aktionen durch
    }
}

async function displayUserName() {
    // Überprüfe, ob die includeHTML-Funktion existiert, bevor du sie aufrufst.
    if (typeof includeHTML === 'function') {
        await includeHTML();
        await includeHTML();
    } else {
        console.log('No includeHTML function found');
    }

    // Jetzt kannst du den restlichen Code ausführen.
    const userNameElement = document.getElementById('activUserName');
    const userProfileElement = document.getElementById('profileButton');
    if (activUser.name) {
        userNameElement.textContent = activUser.name;

        // Rufe getInitials mit dem Benutzernamen auf und setze das Ergebnis als Text des userProfileElement.
        userProfileElement.firstChild.data = getInitialsOf(activUser.name);
    } else {
        console.log('User name nicht gefunden');
    }
}

/**
 * Get the initials from a name.
 * @param {string} name - The name to extract initials from.
 * @returns {string} The initials.
 */
function getInitialsOf(name) {
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .join("");
  }

async function hideMenuIfNotActiveUser() {
    // Überprüfe, ob die includeHTML-Funktion existiert, bevor du sie aufrufst.
    if (typeof includeHTML === 'function') {
        await includeHTML();
        await includeHTML();
    } else {
        return;
    }

    // Jetzt kannst du den restlichen Code ausführen.
    let dnMenu = document.getElementById("menu");
    if (activUser.name == '') {
        dnMenu.style.display = 'none';
    }
}

// Rufe die Funktion auf, um das gewünschte Verhalten auszulösen.
hideMenuIfNotActiveUser();


