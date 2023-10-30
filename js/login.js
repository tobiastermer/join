// msgBox for success registration message
const urlParams = new URLSearchParams(window.location.search);
const msg = urlParams.get('msg');

async function initLogin() {
    activUser = {
        'name': '',
    };
    loadUsers();

    // Load logo animation
    const loginLogo = document.getElementById("login-logo");
    const loginMainContainer = document.getElementById("login-maincontainer");
    const loginNav = document.getElementById("login-nav");

    setTimeout(() => {
        loginLogo.classList.add("move-to-top-left");
    }, 300);
    setTimeout(() => {
        loginMainContainer.classList.add('blend-in');
        loginNav.classList.add('blend-in');
    }, 400);

    // msgBox for success registration message
    const msgBox = document.getElementById('msgBox');

    if (msg) {
        msgBox.innerHTML = msg;
        // Fügen Sie eine CSS-Klasse hinzu, um die Einblendungsanimation zu aktivieren
        msgBox.classList.add('slide-in');
        // Nach 1 Sekunde die Ausblendungsanimation aktivieren
        setTimeout(() => {
            msgBox.classList.add('slide-out');
        }, 1000);
    } else {
        msgBox.classList.add('d-none');
    }
}

/**
 * Loads user data to compare login data with data from the server.
 * @async
 */
async function loadUsers() {
    try {
        users = JSON.parse(await getItem('users'));
    } catch (e) {
        console.error('Loading error:', e);
    }
}

/**
 * Logs in the user and stores the username in activUser.
 */
function login() {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const email = emailInput.value;
    const password = passwordInput.value;
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        // Successful login
        activUser.name = user.userName; // Store the username in activUser

        // Store the activated user in localStorage
        localStorage.setItem('activUser', JSON.stringify(activUser));

        // Redirect to the board.html page
        window.location.href = 'summary.html';
    } else {
        // Login failed
        console.log('Login failed');
    }
}

/**
 * Logs in a user as a guest and fills default data arrays.
 */
function guestLogin() {
    activUser.name = 'Guest743';
    localStorage.setItem('activUser', JSON.stringify(activUser));
    window.location.href = "./summary.html";
}

/**
 * Toggles the visibility of a password field.
 * @param {string} fieldId - The ID of the password field to toggle.
 */
function togglePasswordVisibility(fieldId) {
    let passwordField = document.getElementById(fieldId);

    if (passwordField.type === 'password') {
        passwordField.type = 'text';
    } else {
        passwordField.type = 'password';
    }
}