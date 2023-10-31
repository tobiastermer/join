// msgBox for success registration message
const urlParams = new URLSearchParams(window.location.search);
const msg = urlParams.get('msg');

/**
 * Initializes the user information and checks if already registered.
 */
async function initRegister() {
    loadUsers();
    validatePassword();
    setPasswordVisibilityListener('password', 'passwordToggle');
    setPasswordVisibilityListener('PWconfirm', 'confirmToggle');
    loadMsgBox();
}

/**
 * Loads user data from storage.
 */
async function loadUsers() {
    try {
        users = JSON.parse(await getItem('users'));
    } catch (e) {
        console.error('Loading error:', e);
    }
}

/**
 * Registers a user.
 */
async function register() {
    validatePassword(); // Führen Sie die Validierung durch
    const errorElement = document.getElementById("passwordMismatchError");

    if (errorElement.textContent) {
        return; // Beenden Sie die Registrierung, wenn ein Fehler vorliegt
    }

    const newUserName = userName.value;
    const existingUser = users.find((user) => user.userName === newUserName);

    if (existingUser) {
        // Display an error message if the user is already registered.
        errorElement.textContent = "User already registered";
        return;
    }

    registerBtn.disabled = true;

    users.push({
        userName: newUserName,
        email: email.value,
        password: password.value,
    });

    await setItem('users', JSON.stringify(users));
    resetForm();

    // Redirect to the login page with a success message.
    window.location.href = 'login.html?msg=Registration successful!';
}


/**
 * Resets the registration form after submission.
 */
function resetForm() {
    userName.value = '';
    email.value = '';
    password.value = '';
    PWconfirm.value = '';
    registerBtn.disabled = false;
}

// Password Validation

/**
 * Validates password equality.
 */
function validatePassword() {
    const password = document.getElementById("password");
    const PWconfirm = document.getElementById("PWconfirm");
    const errorElement = document.getElementById("passwordMismatchError");

    if (password.value !== PWconfirm.value) {
        errorElement.textContent = "Ups! your password don’t match";
        PWconfirm.classList.add("error-border");
    } else {
        errorElement.textContent = "";
        PWconfirm.classList.remove("error-border");
    }
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
function setPasswordVisibilityListener(fieldId, imgId) {
    // Monitor the input field for changes
    document.getElementById(fieldId).addEventListener('input', function() {
        let passwordField = document.getElementById(fieldId);
        let eyeIcon = document.getElementById(imgId);
        
        if (passwordField.type === 'password' && passwordField.value) {
            eyeIcon.src = '/img/register-visibility_off.png';
        } else if (passwordField.type === 'password' || 'text' && !passwordField.value) {
            eyeIcon.src = '/img/login-lock.png';
        } else if (passwordField.type === 'text' && passwordField.value) {
            eyeIcon.src = '/img/register-visibility.png';
        }
    });
}

function loadMsgBox() {
    const msgBox = document.getElementById('msgBox');
    const loginBody = document.getElementById('login-body');

    if (msg) {
        msgBox.innerHTML = msg;
        loginBody.classList.add('overlay');
        msgBox.classList.remove('d-none');
        msgBox.classList.add('slide-in');
            // Nach weiteren 1 Sekunde zur Login-Seite weiterleiten
            setTimeout(function () {
                window.location.href = 'login.html';
            }, 2500);
    } else {
        msgBox.classList.add('d-none');
    }
}
