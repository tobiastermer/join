/**
 * Task Management Application
 */

// ****************
// OVERHEAD
// ****************

// Global variables
let board;
let currentDraggedElement;


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

/**
 * Initialize the board content.
 */
function renderTasksToBoard() {
    let board = document.getElementById('board');
    board.innerHTML = '';

    createColumns();
    createHeaders();
    createCards();
    renderCards();

}

// ****************
// BOARD CONTENT
// ****************

/**
 * Creates columns for the board.
 */
function createColumns() {

    for (i = 0; i < progresses.length; i++) {
        document.getElementById('board').innerHTML += `
            <div ondrop="moveTo(${i})" ondragover="allowDrop(event); addHighlight('board-column-${i}')" 
                ondragleave="removeHighlight('board-column-${i}')" 
                class="board-column" id="board-column-${i}">
            </div>
            `;
    }
}

/**
 * Creates headers for the board columns.
 */
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
    };
}

/**
 * Creates cards for tasks.
 */
function createCards() {
    for (i = 0; i < progresses.length; i++) {
        let column = document.getElementById(`board-column-${i}`);
        let hasTask = false;
        // if there is an task with fitted progress then create card
        for (j = 0; j < tasks.length; j++) {
            if (tasks[j].progress == i) {
                hasTask = true;
                column.innerHTML += `<div draggable="true" ondragstart="startDragging(${j})" class="todo-card grow" id="todo-card-${j}"></div>`;
            };
        };
        // if there is no ToDo-Card, then add a no-todo-card
        if (!hasTask) {
            column.innerHTML += `
                <div class="no-todo-card">
                    <p>No tasks To do</p>
                </div>`;
        };
    };
}

/**
 * Renders the content of the cards.
 */
function renderCards() {
    for (i = 0; i < tasks.length; i++) {
        let card = document.getElementById(`todo-card-${i}`);
        let title = tasks[i].title;
        let description = tasks[i].description;
        let categoryName = categories[tasks[i].category].name;
        let categoryColor = categories[tasks[i].category].color;
        let subtasksLength = tasks[i].subtasks.length;
        let subtasksDone = tasks[i].subtasks.filter(subtask => subtask.done === true).length;
        let progressInPercent = divideAndRound(subtasksDone, subtasksLength);
        let assignedToTemplate = getTemplateAssignedTo(tasks[i].assignedTo);
        let taskprio = tasks[i].prio;

        card.innerHTML += `
            <p class="todo-category" style="background-color: ${categoryColor}">${categoryName}</p>
            <div class="todo-title-and-description">
                <p class="todo-title">${title}</h3>
                <p class="todo-description">${description}</p>
            </div>
            <div class="todo-progress-and-subtasks">
                <div class="todo-progress-100">
                    <div class="todo-progress" style="width: ${progressInPercent}%"></div>
                </div>
                <p>${subtasksDone}/${subtasksLength} Subtasks</p>
            </div>
            <div class="todo-persons-and-prio">
                <div class="todo-persons">
                    ${assignedToTemplate}
                </div>
                <div class="todo-prio ${taskprio}"></div>
            </div>
        `;
    };

}

/**
 * Generates the template for assigned contacts.
 * @param {string[]} assignedToArray - Array of assigned contact IDs.
 * @returns {string} - The generated template.
 */
function getTemplateAssignedTo(assignedToArray) {
    let compoundTemplate = '';
    for (j = 0; j < assignedToArray.length; j++) {
        let k = getIndexByIdFromContacts(assignedToArray[j]);
        let initials = contacts[k].initials;
        let color = contacts[k].color;
        if (!color) {
            color = '#87CEFA';
        };
        let style = `background-color: ${color};`
        if (j > 0) {
            style += ` z-index: ${j}; margin-left: -10px;`;
        } else {
            style += '';
        }
        compoundTemplate += `
            <div class="" style="${style}">${initials}</div>
        `;
    }
    return compoundTemplate;
}

// ****************
// DRAG AND DROP
// ****************

function startDragging(i) {
    currentDraggedElement = i;
    console.log(currentDraggedElement);
}

function allowDrop(ev) {
    ev.preventDefault();
}

async function moveTo(i) {
    tasks[currentDraggedElement].progress = i;
    await saveTasks();
    renderTasksToBoard();
}

function addHighlight(element) {
    document.getElementById(element).classList.add('drag-highlight');
}

function removeHighlight(element) {
    document.getElementById(element).classList.remove('drag-highlight');
}

// ****************
// HELPING FUNCTIONS
// ****************



function divideAndRound(a, b) {
    if (a === 0 || b === 0) {
        return 0; // Verhindert Division durch Null und gibt 0 zurück, wenn einer der Werte 0 ist
    }
    return Math.round(a / b * 100);
}