let activUser = {
    'name': '',
};

//Load users to compare logindata to data from server
async function loadUsers() {
    try {
        users = JSON.parse(await getItem('users'));
    } catch (e) {
        console.error('Loading error:', e);
    }
}

//Login user 
function login() {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    
    const email = emailInput.value;
    const password = passwordInput.value;

    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        // Anmeldung erfolgreich
        activUser.name = users.userName; // Den Benutzernamen in activUser speichern

        // Den aktivierten Benutzer in localStorage speichern
        localStorage.setItem('activUser', JSON.stringify(activUser));

        // Hier wird zur board.html Seite weitergeleitet
        // window.location.href = 'summary.html';
    } else {
        // Anmeldung fehlgeschlagen
        console.log('Anmeldung fehlgeschlagen');
    }
}


//Clear activeUser as a logout event
async function initLogin() {
    activUser = {
        'name': '',
    };
    loadUsers();
}

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


//Visual functions
