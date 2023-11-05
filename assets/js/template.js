
// ****************
// USED IN TASKS.JS
// ****************

function getHTMLTemplateRenderContactForList(id, color, name, initials) {
    return `
        <li id="selectContactLi-${id}" onclick="selectContact('${id}'); return false">
            <div class="contact-initials-and-name">
                <div class="contact_initial_image" style="background-color: ${color}">${initials}</div>
                <span>${name}</span>
            </div>
            <img id="addTaskCheckbox-${id}" src="../../img/remember-unchecked.png" alt="">
        </li>
    `;
}

function getHTMLTemplateRenderContactAssignedTo(color, zindex, initials) {
   return `
        <div class="contact_initial_image" style="background-color: ${color}; z-index: ${zindex}; 
        margin-left: -10px; margin-right: 0px;">${initials}</div>
    `; 
}

/**
 * Returns the HTML Template for rendering category name and color.
 * @param {string} name - The name of the category.
 * @param {string} color - The color of the category as '000000'.
 */
function getTemplateCategory(name, color) {
    return `
        <div class="category-color-and-name">
            <div class="category_color" style="background-color: ${color}"></div>
            <span>${name}</span>
        </div>
    `;
}

function getHTMLTemplateRenderCategoryForList(i, template) {
    return `
        <li id="selectCategoryLi-${i}" onclick="selectCategory('${i}'); return false">
            ${template}
        </li>
    `;
}

function getHTMLTemplateRenderAddTaskSubtask(i, checked, subtaskName) {
    return `
        <div class="subtask" id="subtask-${i}">
            <div>
                <input type="checkbox" id="subtask-checkbox-addForm-${i}" class="largerCheckbox" onclick="updateCheckedStatusAddForm()" ${checked}>
                <span>${subtaskName}</span>
            </div>
            <img src="../../img/delete.png" alt="" onclick="deleteSubtask(${i}); return false">
        </div>
    `;
}


// ****************
// USED IN BOARD.JS
// ****************

function getHTMLTemplateCreateColumn(i) {
    return `
        <div class="board-column" id="board-column-${i}">
        </div>
    `;
}

function getHTMLTemplateCreateHeader(i, progressName) {
    return `
        <div class="board-column-header">
            <h3>${progressName}</h3>
            <div class="img-add" onclick="showAddTaskOverlay(${i}, 'add'); return false"></div>
        </div>
        <div class="board-column-content" id="board-column-content-${i}" 
            ondrop="moveTo(${i})" ondragover="allowDrop(event); addHighlight('board-column-content-${i}')" 
            ondragleave="removeHighlight('board-column-content-${i}')">
        </div>
    `;
}

function getHTMLTemplateCreateToDoCard(currentTaskId) {
    return `
        <div draggable="true" ondragstart="startDragging('${currentTaskId}')" 
        class="todo-card grow" id="todo-card-${currentTaskId}" 
        onclick="initDetailedCard('${currentTaskId}'); return false"></div>
    `;
}

function getHTMLTemplateCreateNoToDoCard(progress) {
    return `
        <div class="no-todo-card">
            <p>No tasks ${progress}</p>
        </div>
    `;
}


function getHTMLTemplateRenderCard(categoryColor, categoryName, title, description, progressInPercent, subtasksDone, subtasksLength, assignedToTemplate, taskprio) {
    return `
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
}

/**
 * Generates an HTML template for assigned contacts based on a task index.
 * @param {number} i - The index of the task in the globalTasks array.
 * @returns {string} - HTML template for assigned contacts.
 */
function getTemplateAssignedToContacts(i) {
    let assignedToContacts = globalTasks[i].assignedTo;
    let template = '';
    for (let j = 0; j < assignedToContacts.length; j++) {
        let id = assignedToContacts[j];
        let contactIndex = getIndexByIdFromComplexArray(id, contacts);
        if (contactIndex >= 0) {
            let initials = contacts[contactIndex].initials;
            let name = contacts[contactIndex].name;
            let color = contacts[contactIndex].color;
            template = template + getHTMLTemplateDetailedCardAssignedToContacts(color, initials, name);
        }
    };
    return template;
}

function getHTMLTemplateDetailedCardAssignedToContacts(color, initials, name) {
    return `
        <li>
            <div class="contact-initials-and-name">
                <div class="contact_initial_image" style="background-color: ${color}">${initials}</div>
                <span>${name}</span>
            </div>
        </li>
    `;
}

/**
 * Generates an HTML template for subtasks based on a task index.
 * @param {number} i - The index of the task in the globalTasks array.
 * @returns {string} - HTML template for subtasks.
 */
function getTemplateSubtasks(i) {
    let subtasks = globalTasks[i].subtasks;
    let template = '';
    for (let j = 0; j < subtasks.length; j++) {
        let subtaskName = subtasks[j].name;
        let subtaskDone = subtasks[j].done;
        let checked = '';
        if (subtaskDone) {
            checked = 'checked';
        } else {
            checked = '';
        };
        template = template + getHTMLTemplateDetailedCardSubtasks(i, j, checked, subtaskName);
    };
    return template;
}

function getHTMLTemplateDetailedCardSubtasks(i, j, checked, subtaskName) {
    return `
        <div class="subtask" id="subtask-${j}">
            <div>
                <input type="checkbox" id="subtask-checkbox-showCard-${j}" class="largerCheckbox" onclick="updateCheckedStatusShowCard(${i})" ${checked}>
                <span>${subtaskName}</span>
            </div>
        </div>
    `;
}