/**
 * Initializes the login page.
 * Loads user data, handles animations, and displays success messages.
 */
async function initLogin() {
    activUser = {
        'name': '',
    };
    loadUsers();
    initLogoAnimation();
    setPasswordVisibilityListener();
}

/**
 * Loads user data from the server for login comparisons.
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

// Visual Functions ///////////////////////////////////////////////////////

/**
 * Toggles the visibility of a password field and updates the associated icon.
 * @param {string} fieldId - The ID of the password field to toggle.
 * @param {string} imgId - The ID of the associated icon to update.
 */
function togglePasswordVisibility(fieldId, imgId) {
    let passwordField = document.getElementById(fieldId);
    let eyeIcon = document.getElementById(imgId);

    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        eyeIcon.src = '/img/register-visibility.png'; // Change the icon to "visibility.png"
    } else {
        passwordField.type = 'password';
        if (passwordField.value) {
            eyeIcon.src = '/img/register-visibility_off.png'; // Change the icon to "visibility-off.png"
        } else {
            eyeIcon.src = '/img/login-lock.png'; // Change the icon to "lock.png"
        }
    }
}

/**
 * Initializes the password visibility toggle listener to update the icon based on user input.
 */
function setPasswordVisibilityListener() {
    // Monitor the input field for changes
    document.getElementById('password').addEventListener('input', function() {
        let passwordField = document.getElementById('password');
        let eyeIcon = document.getElementById('passwordToggle');
        
        if (passwordField.type === 'password' && passwordField.value) {
            eyeIcon.src = '/img/register-visibility_off.png';
        } else if (passwordField.type === 'password' || 'text' && !passwordField.value) {
            eyeIcon.src = '/img/login-lock.png';
        } else if (passwordField.type === 'text' && passwordField.value) {
            eyeIcon.src = '/img/register-visibility.png';
        }
    });
}

function initLogoAnimation(){
        // Load logo animation
        const loginLogo = document.getElementById("login-logo");
        const loginMainContainer = document.getElementById("login-maincontainer");
        const loginNav = document.getElementById("login-nav");
    
        // Apply logo animation with a delay
        setTimeout(() => {
            loginLogo.classList.add("move-to-top-left");
        }, 300);
        setTimeout(() => {
            loginMainContainer.classList.add('blend-in');
            loginNav.classList.add('blend-in');
        }, 400);
}