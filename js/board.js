/**
 * Task Management Application
 */

// ****************
// OVERHEAD
// ****************

// Global variables
let board;


// Array for different progress levels
let progresses = [
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
async function initBoard() {
    await loadTasks();
    await loadContactsForTasks();
    renderTasksToBoard();
}

function renderTasksToBoard() {
    document.getElementById('board').innerHTML = '';
    
    createColumns();
    createHeaders();
    createCards();

}

// ****************
// BOARD CONTENT
// ****************

function createColumns() {
    let board = document.getElementById('board');

    for (i = 0; i < progresses.length; i++) {
        board.innerHTML += `<div class="board-column" id="board-column-${i}"></div>`;
    }
}

function createHeaders() {
    for (i = 0; i < progresses.length; i++) {
        let progressName = progresses[i];
        let column = document.getElementById(`board-column-${i}`);
        column.innerHTML += `
            <div class="board-column-header">
                <h3>${progressName}</h3>
                <img src="img/add.png" alt="" onclick="showAddTaskOverlay(${i}); return false">
            </div>
        `;
    }
}

function createCards(i) {

}