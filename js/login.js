/**
 * Clears the activeUser as part of the logout event.
 * @async
 */
async function initLogin() {
    activUser = {
        'name': '',
    };
    loadUsers();
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