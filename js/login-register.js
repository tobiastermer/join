let users = [];

//Register user

async function register() {
    registerBtn.disabled = true;
    users.push({
        userName: userName.value, 
        email: email.value,
        password: password.value,
        PWconfirm: PWconfirm.value,
    });
    await setItem('users', JSON.stringify(users));
    resetForm();
    // Weiterleitung zu Login Seite + Nachricht anzeigen: "Erfolgreiche Registration"
    //  window.location.href = 'login.html?msg=Du hast dich erfolgreich registriert';
}



//Login user 
function login() {
    let email = document.getElementById('email');
    let password = document.getElementById('password');
    let user = users.find(u => u.email == email.value && u.password == password.value);
    console.log(user);
    if (user) {
        console.log('User gefunden')
    }
}

//Load user
async function init() {
    loadUsers();
}

async function loadUsers() {
    try {
        users = JSON.parse(await getItem('users'));
    } catch (e) {
        console.error('Loading error:', e);
    }
}

function resetForm() {
    userName.value = '';
    email.value = '';
    password.value = '';
    PWconfirm.value = '';
    registerBtn.disabled = false;
}


// Visual Functions
function togglePasswordEye() {
    let password = document.getElementById('password');
    let confirm = document.getElementById('confirm');

    if (password.value) {
        password.classList.add('addPasswordEye');
    } else {
        password.classList.remove('addPasswordEye');
    }

    if (PWconfirm.value) {
        PWconfirm.classList.add('addPasswordEye');
    } else {
        PWconfirm.classList.remove('addPasswordEye');
    }
}

function togglePasswordVisibility(fieldId) {
    let passwordField = document.getElementById(fieldId);

    if (passwordField.type === 'password') {
        passwordField.type = 'text';
    } else {
        passwordField.type = 'password';
    }
}