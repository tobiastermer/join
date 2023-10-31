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
    let password = document.getElementById("password");
    let PWconfirm = document.getElementById("PWconfirm");
    password.onchange = validatePassword;
    PWconfirm.onkeyup = validatePassword;
    if (password.value !== PWconfirm.value) {
        PWconfirm.setCustomValidity("Passwörter stimmen nicht überein!");
    } else {
        PWconfirm.setCustomValidity('');
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
    // msgBox for success registration message
    const msgBox = document.getElementById('msgBox');

    if (msg) {
        msgBox.innerHTML = msg;
        // Add a CSS class to activate the slide-in animation
        msgBox.classList.add('slide-in');
        // Activate the slide-out animation after 1 second
        setTimeout(() => {
            msgBox.classList.add('slide-out');
        }, 1000);
    } else {
        msgBox.classList.add('d-none');
    }
}
