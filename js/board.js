/**
 * Task Management Application
 */

// ****************
// OVERHEAD
// ****************

// Global variables



// Array for different progress levels
let progressbar = [
    "To Do",
    "In Progress",
    "Await Feedback",
    "Done"
];

// ****************
// INITIALIZE
// ****************

/**
 * Initialize the application.
 */
function initBoard() {
    loadTasks();
    loadContactsForTasks();
    renderTasksToBoard();
}

function renderTasksToBoard() {
    let board = document.getElementById('board');
    board.innerHTML = '';


}

// ****************
// BOARD CONTENT
// ****************

function createColumn(i) {

}

function createHeader(i) {

}

function createCard(i) {

}