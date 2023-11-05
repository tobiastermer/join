/**
 * @module TaskManagement_Module
 * @description The TaskManagement area of the page
 */

/**
 * Task Management Application
 */

// ****************
// OVERHEAD
// ****************

// Global variables
let globalTasks = [];
let filteredTaskIDs = [];
let selectedPrio;
let selectedCategory;
let selectedContacts = [];
let isAssignToDropdownActive = false;
let isCategoryDropdownActive = false;
let filteredContacts = [];
let selectedSubtasks = [];
let progress;
let mode;

// ****************
// INITIALIZE
// ****************

/**
 * Initialize the application.
 */
async function initAddTask(progressIndex, inputMode) {
    await loadTasks();
    await initContactList();
    initCategories();
    progress = progressIndex;
    selectedSubtasks = [];
    hideAddContactOverlay();
    disableTaskSubmitButton(false);
    currentTaskId = '';
    currentTaskIndex = '';
    mode = inputMode;
}

/**
 * Load tasks from storage.
 */
async function loadTasks() {
    try {
        globalTasks = JSON.parse(await getItem("tasks"));
    } catch (e) {
        console.error("Loading error:", e);
    }
}

/**
 * Show the overlay for adding a new task.
 */
async function showAddTaskOverlay(progressIndex, mode) {
    document.getElementById("addTaskOverlay").style.display = "flex";
    document.getElementById("addTaskOverlay").style.zIndex = "1000";
    document.getElementById("addTask-close-button").style.display = "flex";
    await initAddTask(progressIndex, mode);
}

/**
 * Hide the overlay for adding a new task.
 */
function closeAddTaskOverlay() {
    document.getElementById("addTaskOverlay").style.display = "none";
    document.getElementById("addTask-close-button").style.display = "none";

}

// ****************
// CONTACTS
// ****************

/**
 * Initialize the contact list inside the add task form.
 */
async function initContactList() {
    await loadContactsForTasks();
    // filterContacts();
    selectedContacts = [];
    renderContactList();
    renderSelectedContacts();
}

/**
 * Load contacts from storage.
 */
async function loadContactsForTasks() {
    try {
        contacts = JSON.parse(await getItem("contacts"));
    } catch (e) {
        console.error("Loading error:", e);
    }
}

/**
 * Rendering contacts to dropdownlist inside the add task form.
 */
function renderContactList() {
    let selectContactList = document.getElementById('addTaskListContacts');
    selectContactList.innerHTML = '';
    if (contacts.length > 0) {
        for (let i = 0; i < contacts.length; i++) {
            let id = contacts[i].id
            let name = contacts[i].name;
            let initials = contacts[i].initials;
            let color = contacts[i].color;
            selectContactList.innerHTML += getHTMLTemplateRenderContactForList(id, color, name, initials);
        };
    };
}

/**
 * Filtering contacts for contact search function.
 */
function filterContacts() {
    let input = document.getElementById('addTaskInputContacts').value.toLowerCase();
    filteredContacts = [];
    if (input !== '') {
        filteredContacts = contacts.filter(contact => {
            return contact.name.toLowerCase().includes(input);
        });
    } else {
        filteredContacts = contacts;
    }
}

/**
 * Switch between Display and Hidden of the dropdown contact list.
 */
function toggleContactList() {
    if (isAssignToDropdownActive) {
        hideContactList();
    } else {
        showContactList();
    };
}

/**
 * Hide the dropdown contact list.
 */
function hideContactList() {
    isAssignToDropdownActive = false;
    document.getElementById('addTaskListContactsContainer').classList.add('d-none');
    document.getElementById('addTaskImgDropdownContacts').src = '../../img/dropdown_down.png'
}

/**
 * Show the dropdown contact list.
 */
function showContactList() {
    isAssignToDropdownActive = true;
    document.getElementById('addTaskListContactsContainer').classList.remove('d-none');
    document.getElementById('addTaskImgDropdownContacts').src = '../../img/dropdown_up.png'
}

/**
 * Assings or removes contact from the dropdownlist to task
 * @param {string} id - The unique ID of the contact to select.
 */
function selectContact(id) {
    let i = getIndexById(id, selectedContacts);
    if (i > -1) { // deactivates contact
        removeFromSelectedContacts(id);
    } else { // activates selected contact
        addToSelectedContacts(id);
    }
    renderSelectedContacts();
}

/**
 * Checks, if contact is already assignet to task.
 * @param {string} id - The unique ID of the contact to select.
 */
function isIdInSelectedContacts(id) {
    return selectedContacts.includes(id);
}

/**
 * Removes contact from assignment to task.
 * @param {string} id - The unique ID of the contact to select.
 */
function removeFromSelectedContacts(id) {
    let i = selectedContacts.indexOf(id);
    selectedContacts.splice(i, 1);
    setContactLiStyle(id, '#FFFFFF', '#000000', "../../img/remember-unchecked.png");
}

/**
 * Adds contact to assignment.
 * @param {string} id - The unique ID of the contact to select.
 */
function addToSelectedContacts(id) {
    let i = getIndexById(id, selectedContacts);
    if (i < 0) {
        selectedContacts.push(id);
    };
    setContactLiStyle(id, '#2A3647', '#FFFFFF', "../../img/remember-checked-white.png");
}

/**
 * Sets the color and design for contact inside the dropdownlist, depends of if he is already assignt to or not
 * @param {string} id - The unique ID of the contact to select.
 * @param {string} bgColor - The background-color of the contact as '000000'.
 * @param {string} textColor - Colorcode of white or black as '000000'.
 * @param {string} imgSrc - The path to img for checked or unchecked icon.
 */
function setContactLiStyle(id, bgColor, textColor, imgSrc) {
    // let i = getIndexById(id, selectedContacts); //ggf. löschen
    let liElement = document.getElementById(`selectContactLi-${id}`);
    let checkboxElement = document.getElementById(`addTaskCheckbox-${id}`);
    try {
        liElement.style.backgroundColor = bgColor;
        liElement.style.color = textColor;
        checkboxElement.src = imgSrc;
    } catch { };
}

/**
 * Displays all contacts with their initials who are actually assignet to the task.
 */
function renderSelectedContacts() {
    let showContactsContainer = document.getElementById('addTaskShowSelectedContacts');
    if (selectedContacts.length > 0) {
        showContactsContainer.classList.remove('d-none');
        showContactsContainer.innerHTML = '';
        for (i = 0; i < selectedContacts.length; i++) {
            let id = selectedContacts[i];
            let j = getIndexByIdFromComplexArray(id, contacts);
            if (j >= 0) {
                let initials = contacts[j].initials;
                let color = contacts[j].color;
                let zindex = i + 1;
                showContactsContainer.innerHTML += getHTMLTemplateRenderContactAssignedTo(color, zindex, initials);
            };
        };
    } else {
        showContactsContainer.classList.add('d-none');
    };
}

/**
 * Add a new contact to the list.
 */
async function addContactExtra() {
    let fullName = document.getElementById("addContactName").value;
    let email = document.getElementById("addContactEmail").value;
    let phone = document.getElementById("addContactPhone").value;
    let initials = getInitials(fullName);

    if (!checkForRightInput(fullName, email, phone)) {
        return;
    }

    let randomColor =
        contactColors[Math.floor(Math.random() * contactColors.length)];

    contacts.push({
        name: fullName,
        email: email,
        phone: phone,
        initials: initials,
        color: randomColor,
        id: generateUniqueId(),
    });

    localStorage.setItem(
        "contactColors",
        JSON.stringify(contacts.map((contact) => contact.color))
    );

    await setItem("contacts", JSON.stringify(contacts));
    renderContactList();
    hideAddContactOverlay();
    showSuccessMessage('Contact succesfully created');
}

// ****************
// PRIORITIES
// ****************

/**
 * Adds color to prio-button after clicking on it.
 * @param {string} prio - high, med or low prio.
 */
function setPrio(prio) {
    resetPrio();
    selectedPrio = prio;
    if (selectedPrio !== '') {
        document.getElementById(`img-prio-${prio}`).classList.add(`prio-${prio}-active`);
        document.getElementById(`btn-prio-${prio}`).classList.add(`bg-prio-${prio}-active`);
    };
}

/**
 * Resets color of prio buttons.
 */
function resetPrio() {
    selectedPrio = '';
    // Remove 'active' class from all buttons
    const prios = ['high', 'med', 'low'];
    prios.forEach(p => {
        document.getElementById(`img-prio-${p}`).classList.remove(`prio-${p}-active`);
        document.getElementById(`btn-prio-${p}`).classList.remove(`bg-prio-${p}-active`);
    });
}

// ****************
// CATEGORIES
// ****************

/**
 * Initialize the category list inside the add task form.
 */
function initCategories() {
    renderCategoryList();
}

/**
 * Switch between Display and Hidden of the dropdown category list.
 */
function toggleCategoryList() {
    if (isCategoryDropdownActive) {
        hideCategoryList();
    } else {
        showCategoryList();
    };
}

/**
 * Hide the dropdown category list.
 */
function hideCategoryList() {
    isCategoryDropdownActive = false;
    document.getElementById('addTaskListCategoriesContainer').classList.add('d-none');
    document.getElementById('addTaskImgDropdownCategory').src = '../../img/dropdown_down.png'
}

/**
 * Hide the dropdown category list.
 */
function showCategoryList() {
    isCategoryDropdownActive = true;
    document.getElementById('addTaskListCategoriesContainer').classList.remove('d-none');
    document.getElementById('addTaskImgDropdownCategory').src = '../../img/dropdown_up.png'
}

/**
 * Rendering categories to dropdownlist inside the add task form.
 */
function renderCategoryList() {
    let selectCategoryList = document.getElementById('addTaskListCategories');
    selectCategoryList.innerHTML = '';
    for (let i = 0; i < categories.length; i++) {
        let name = categories[i].name;
        let color = categories[i].color;
        let template = getTemplateCategory(name, color);
        selectCategoryList.innerHTML += getHTMLTemplateRenderCategoryForList(i, template);
    };
}

/**
 * Selects the category to task.
 * @param {int} i - The index of category in categories array.
 */
function selectCategory(i) {
    selectedCategory = i;
    let name = categories[i].name;
    let color = categories[i].color;
    let template = getTemplateCategory(name, color);
    let categoryDisplay = document.getElementById('addTaskCategory');
    categoryDisplay.innerHTML = '';
    categoryDisplay.innerHTML += `${template}`;
    hideCategoryList();
}

/**
 * Resets the selected prio from task.
 */
function resetCategory() {
    document.getElementById('addTaskCategory').innerHTML = '';
    document.getElementById('addTaskCategory').innerHTML = 'Select task category';
    selectedPrio = '';
}

// ****************
// SUBTASKS
// ****************

/**
 * Adds the entered subtask to the array.
 */
function addSubtask() {
    let subtask = [];
    let subtaskName = document.getElementById('addTaskSubtaskInput').value;
    if (subtaskName.length >= 3) {
        selectedSubtasks.push({
            name: subtaskName,
            done: false,
        });
        renderSubtaskList();
    }
    document.getElementById('addTaskSubtaskInput').value = '';
}

/**
 * Deletes subtask from array and list.
 * @param {int} i - The Index number of subtask in list.
 */
function deleteSubtask(i) {
    selectedSubtasks.splice(i, 1);
    renderSubtaskList();
}

/**
 * Creates list of all entered subtasks.
 */
function renderSubtaskList() {
    let subtaskList = document.getElementById('addTaskSubtaskList');
    if (selectedSubtasks.length > 0) {
        subtaskList.classList.remove('d-none');
        subtaskList.innerHTML = '';
        for (i = 0; i < selectedSubtasks.length; i++) {
            let subtaskName = selectedSubtasks[i].name;
            let subtaskDone = selectedSubtasks[i].done;
            let checked = '';
            if (subtaskDone) {
                checked = 'checked';
            } else {
                checked = '';
            }
            subtaskList.innerHTML += getHTMLTemplateRenderAddTaskSubtask(i, checked, subtaskName);
        };
    } else {
        subtaskList.classList.add('d-none');
    };
}

/**
 * Updates selectedSubtasks Array with checked Status from checked-boxes.
 */
function updateCheckedStatusAddForm() {
    selectedSubtasks = updatedArrayCheckedStatus(selectedSubtasks, 'addForm')
}

/**
 * Checks, if there are any new Checks or Unchecks of subtasks and saving them to array.
 * card can be showCard oder addForm
 */
// needs to work both for stored and temporary subtasks
function updatedArrayCheckedStatus(subtaskArray, card) {
    for (let i = 0; i < subtaskArray.length; i++) {
        try {
            let subtaskChecked = document.getElementById(`subtask-checkbox-${card}-${i}`).checked;
            if (subtaskChecked) {
                subtaskArray[i].done = true;
            } else {
                subtaskArray[i].done = false;
            };
        } catch {
            // ggf. Fehlermeldung
        };
    };
    return subtaskArray;
}

// ****************
// SUBMIT
// ****************

/**
 * Coordinates creating a new task and stores it to storage.
 */
async function submitTask() {
    disableTaskSubmitButton(true);
    try {
        if (isTaskFormFilledCorrectly()) {
            // updateSubtasksCheckedStatus('addForm');
            selectedSubtasks = updatedArrayCheckedStatus(selectedSubtasks, 'addForm');
            pushTaskToArray();
            await saveTasks();
            resetAddTask();
            goToBoard();
        } else {
            disableTaskSubmitButton(false);
        }
    } catch (error) {
        console.error("Ein Fehler ist aufgetreten:", error);
        disableTaskSubmitButton(false);
    }
}

/**
 * Enables or disables the task submit button based on the provided boolean value.
 * @param {boolean} trueOrFalse - If true, the button will be disabled, otherwise it will be enabled.
 */
function disableTaskSubmitButton(trueOrFalse) {
    const createTaskButton = document.querySelector('.btn-primary[type="submit"]');
    if (trueOrFalse == true) {
        createTaskButton.disabled = true;
    } else {
        createTaskButton.disabled = false;
    };
}

/**
 * Saves the global tasks to local storage.
 * @returns {Promise<void>} A promise that resolves when the tasks are saved.
 * @async
 */
async function saveTasks() {
    await setItem('tasks', JSON.stringify(globalTasks));
}

/**
 * Navigates to the board page or updates the current board view based on the current mode and URL.
 * If the current page is 'board.html', it will either add a new task or edit an existing task.
 * If the current page is not 'board.html', it will navigate to 'board.html'.
 */
function goToBoard() {
    if (window.location.href.indexOf("board.html") > -1) {
        if (mode == 'add') { //add new task mode
            returnToBoardAfterAddTask();
        } else { //edit mode
            returnToBoardAfterEditTask();
        };
    } else {
        showSuccessMessage('Task succesfully created');
        setTimeout(function() {
            window.location.href = 'board.html';
        }, 750); // 750 Millisekunden = 0,75 Sekunde
    };
}

/**
 * Updates the board view after adding a new task.
 * It hides the task overlay, closes the add task overlay, initializes the board, 
 * and then displays a success message.
 */
function returnToBoardAfterAddTask() {
    hideTaskOverlay();
    closeAddTaskOverlay();
    initBoard();
    showSuccessMessage('Task succesfully created');
}

/**
 * Updates the board view after editing an existing task.
 * It closes the add task overlay, renders the tasks to the board, displays the details of the edited task,
 * and then displays a success message.
 */
function returnToBoardAfterEditTask() {
    let storedTaskIndex = currentTaskIndex; // renderTasksToBoard will overwrite currentTaskIndex
    closeAddTaskOverlay();
    renderTasksToBoard();
    renderDetailedCard(storedTaskIndex);
    showSuccessMessage('Task succesfully edited');
}

/**
 * Checks whether all required fields are filled in completely and plausibly.
 */
function isTaskFormFilledCorrectly() {
    let errors = [];

    // Category
    if (selectedCategory === undefined || selectedCategory === null || selectedCategory == '') {
        errors.push("Please select a category.");
        showErrorMessage("Please select a category.");
    }

    // Prio
    if (selectedPrio === undefined || selectedPrio === null || selectedPrio == '') {
        errors.push("Please select a prio.");
        showErrorMessage("Please select a prio.");
    }

    if (errors.length > 0) {
        return false;
    } else {
        return true;
    }
}

/**
 * Pushes new task to task array.
 */
function pushTaskToArray() {
    let array = buildTaskArray();
    if (mode == 'add') { // add mode
        globalTasks.push(array);
    } else { // edit mode
        globalTasks[currentTaskIndex] = array;
    };
}

/**
 * Builds the task array before pushing it into the global tasks array.
 */
function buildTaskArray() {
    // Variablen definieren
    let assignedTo = selectedContacts;
    let subtasks = selectedSubtasks.slice();
    return {
        id: getTaskID(),
        title: document.getElementById('addTaskTitle').value,
        description: document.getElementById('addTaskDescription').value,
        assignedTo: assignedTo,
        dueDate: document.getElementById('addTaskDueDate').value,
        prio: selectedPrio,
        category: selectedCategory,
        subtasks: subtasks,
        progress: progress,
    };
}

/**
 * Returns a new unique id in case of adding a new task 
 * or returns the id of an existing task in case of edit mode.
 */
function getTaskID() {
    if (mode == 'add') {
        return generateUniqueId();
    } else {
        return currentTaskId;
    };
}

// ****************
// CANCEL
// ****************

/**
 * Clears all inputs in add task form.
 */
function resetAddTask() {
    resetAddTaskFieldValues();
    resetPrio();
    resetCategory();
    hideContactList();
    hideCategoryList();
    renderSubtaskList();
    initAddTask();
}

/**
 * Clears all inputs in add task form as well as temporary variables and arrays.
 */
function resetAddTaskFieldValues() {
    // Reset arrays
    selectedContacts = [];
    selectedSubtasks = [];

    // Reset header and buttons
    document.getElementById('addTask-header-h1').innerHTML = 'Add Task';
    document.getElementById('addTaskBtnSubmit').innerHTML = 'Create Task';
    document.getElementById('addTaskBtnClear').setAttribute('onclick', 'resetAddTask(); return false');

    // Reset field values
    document.getElementById('addTaskTitle').value = '';
    document.getElementById('addTaskDescription').value = '';
    document.getElementById('addTaskDueDate').value = '';
    document.getElementById('addTaskCategory').value = '';
    document.getElementById('addTaskSubtaskInput').value = '';
    document.getElementById('addTaskSubtaskList').innerHTML = '';
}

// ****************
// HELPING FUNCTIONS
// ****************

/**
 * Looks for the index of an ID inside an array.
 * @param {string} id - The ID to search for in the array.
 * @param {array} array - The array to be searched.
 */
function getIndexById(id, array) {
    return array.indexOf(id);
}

/**
 * Looks for the index of an contact-ID inside the contact-array.
 * @param {string} id - The ID to search for in the array.
 */
function getIndexByIdFromComplexArray(id, array) {
    for (let i = 0; i < array.length; i++) {
        if (id == array[i].id) {
            return i;
        };
    };
    return -1;
}

/**
 * Adds an event listener to the 'addTaskSubtaskInput' element.
 * When the 'Enter' key is pressed, the default behavior of the browser (e.g., form submission) is prevented,
 * and the `addSubtask` function is called to add a new subtask.
 */
document.querySelector('addTaskSubtaskInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        e.preventDefault(); // Verhindert das standardmäßige Verhalten des Browsers (z.B. das Absenden eines Formulars)
        addSubtask();
    }
});