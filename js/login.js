/**
 * Object to store the active user's information.
 * @type {Object}
 */
let activUser = {
    'name': '',
};

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
    /**
     * Input field for user email.
     * @type {HTMLInputElement}
     */
    const emailInput = document.getElementById('email');

    /**
     * Input field for user password.
     * @type {HTMLInputElement}
     */
    const passwordInput = document.getElementById('password');
    
    /**
     * The user's entered email.
     * @type {string}
     */
    const email = emailInput.value;

    /**
     * The user's entered password.
     * @type {string}
     */
    const password = passwordInput.value;

    /**
     * The user object found by matching email and password.
     * @type {Object|undefined}
     */
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        // Successful login
        activUser.name = user.userName; // Store the username in activUser

        // Store the activated user in localStorage
        localStorage.setItem('activUser', JSON.stringify(activUser));

        // Redirect to the board.html page
        // window.location.href = 'summary.html';
    } else {
        // Login failed
        console.log('Login failed');
    }
}

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
 * Loads the active user's data from localStorage, if available.
 */
function loadActiveUser() {
    /**
     * The JSON string containing the active user's data from localStorage.
     * @type {string|null}
     */
    const activUserJSON = localStorage.getItem('activUser');

    if (activUserJSON) {
        activUser = JSON.parse(activUserJSON);
        // Change 'name' to 'userName' or an appropriate identifier
        userName = activUser.name;
    } else {
        // The user is not logged in or the information has been deleted
        // Perform appropriate actions
    }
}
