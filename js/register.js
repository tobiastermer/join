/**
 * Array to store registered users.
 */
let password = document.getElementById("password");
let PWconfirm = document.getElementById("PWconfirm");

/**
 * Registers a user.
 */
async function register() {
    registerBtn.disabled = true;
    users.push({
        userName: userName.value,
        email: email.value,
        password: password.value,
    });
    await setItem('users', JSON.stringify(users));
    resetForm();
    // Redirect to the login page with a success message.
    window.location.href = 'login.html?msg=Registration successful!';
}

/**
 * Initializes the user information and checks if already registered.
 */
async function initRegister() {
    loadUsers();
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
    if (password.value !== PWconfirm.value) {
        PWconfirm.setCustomValidity("Passwörter stimmen nicht überein!");
    } else {
        PWconfirm.setCustomValidity('');
    }
}

password.onchange = validatePassword;
PWconfirm.onkeyup = validatePassword;

// Visual Functions

/**
 * Toggles the visibility of the password.
 */
function togglePasswordEye() {
    let password = document.getElementById('password');
    let PWconfirm = document.getElementById('PWconfirm');

    if (password.value) {
        password.src = '/img/register-visibility_off.png';
    } else {
        password.src = '/img/login-lock.png';
    }

    if (PWconfirm.value) {
        PWconfirm.src = '/img/register-visibility_off.png';
    } else {
        PWconfirm.src = '/img/login-lock.png';
    }
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
