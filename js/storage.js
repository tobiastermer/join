/**
 * Constant to store the storage token.
 * @type {string}
 */
const STORAGE_TOKEN = 'YDITW3FZPTKXOANID4RLEPARCUN9OMMKIJBM9WO8';

/**
 * Base URL for remote storage.
 * @type {string}
 */
const STORAGE_URL = 'https://remote-storage.developerakademie.org/item';

/**
 * Object to store the active user's information.
 * @type {Object}
 */
let activUser = {
    'name': '',
};

/**
 * Array to store user information.
 * @type {Array}
 */
let users = [];

/**
 * Asynchronously set an item in remote storage.
 * @param {string} key - The key to store the item under.
 * @param {any} value - The value to store.
 * @returns {Promise} A promise that resolves when the item is set.
 */
async function setItem(key, value) {
    const payload = { key, value, token: STORAGE_TOKEN };
    return fetch(STORAGE_URL, { method: 'POST', body: JSON.stringify(payload) })
        .then(res => res.json());
}

/**
 * Asynchronously get an item from remote storage.
 * @param {string} key - The key to retrieve the item.
 * @returns {Promise} A promise that resolves with the retrieved item.
 */
async function getItem(key) {
    const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
    return fetch(url)
        .then(res => res.json())
        .then(res => {
            if (res.data) {
                return res.data.value;
            }
            throw `Could not find data with key "${key}".`;
        });
}

/**
 * Initialize user-related summary information.
 */
async function initUserName() {
    loadActiveUser();
    // hideMenuIfNoActiveUser();
    displayUserName();
}

/**
 * Load the active user's information from localStorage.
 */
function loadActiveUser() {
    // Load the active user from localStorage if available.
    const activUserJSON = localStorage.getItem('activUser');

    if (activUserJSON) {
        activUser = JSON.parse(activUserJSON);
        // Modify 'name' to 'userName' or another appropriate identifier.
        userName = activUser.name;
    } else {
        // The user is not logged in, or the information has been deleted.
        // Perform appropriate actions.
    }
}

/**
 * Asynchronously display the user's name and initials.
 */
async function displayUserName() {
    // Check if the includeHTML function exists before calling it.
    if (typeof includeHTML === 'function') {
        await includeHTML();
    } else {
        console.log('No includeHTML function found');
    }

    // Continue with the rest of the code.
    const userNameElement = document.getElementById('activUserName');
    const userProfileElement = document.getElementById('profileButton');

    // Check if userNameElement exists and if activUser.name is defined.
    if (userNameElement && activUser.name) {
        userNameElement.textContent = activUser.name;
    }

    // Set userProfileElement.innerHTML to the user's initials, regardless of whether userNameElement exists.
    userProfileElement.innerHTML = getInitialsOf(activUser.name || "");
}

/**
 * Get the initials from a full name.
 * @param {string} name - The name to extract initials from.
 * @returns {string} The initials.
 */
function getInitialsOf(name) {
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .join("");
  }

/**
 * Asynchronously hide the menu if the user is not active.
 */
async function hideMenuIfNoActiveUser() {
    // Check if the includeHTML function exists before calling it.
    if (typeof includeHTML === 'function') {
        await includeHTML();
    } else {
        return;
    }

    // Continue with the rest of the code.
    let dnMenu = document.getElementById("menu");
    if (activUser.name == '') {
        dnMenu.style.display = 'none';
    }
}

