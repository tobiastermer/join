let users = [ //Testwise array of users
    {'email': 'pierce@test.de', 'password': 'test123'}
];

//Register user
function addUser() {
    console.log('TEST')
    let name = document.getElementById('name');
    let email = document.getElementById('email');
    let password = document.getElementById('password');
    users.push({'email': email.value, 'password': password.value, 'name': name.value});
    // Weiterleitung zu Login Seite + Nachricht anzeigen: "Erfolgreiche Registration"
    window.location.href = 'login.html?msg=Du hast dich erfolgreich registriert';
}

//Login user 
function login() {
    debugger;
    let email = document.getElementById('email');
    let password = document.getElementById('password');
    let user = users.find( u => u.email == email.value && u.password == password.value);
    console.log(user);
    if(user) {
        console.log('User gefunden')
    }
}

//Load user
async function init(){
    loadUsers();
}

async function loadUsers(){
    try {
        users = JSON.parse(await getItem('users'));
    } catch(e){
        console.error('Loading error:', e);
    }
}


async function register() {
    registerBtn.disabled = true;
    users.push({
        email: email.value,
        password: password.value,
    });
    await setItem('users', JSON.stringify(users));
    resetForm();
}

function resetForm() {
    email.value = '';
    password.value = '';
    registerBtn.disabled = false;
}


// Visual Functions
function togglePasswordEye() {
    let password = document.getElementById('password');
    password.classList.add('addPasswordEye');
}

function togglePasswordConfirmEye() {
    let confirm = document.getElementById('confirm');
    confirm.classList.add('addPasswordEye');
}