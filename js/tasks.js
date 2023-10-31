/**
 * Task Management Application
 */

// ****************
// OVERHEAD
// ****************

// Global variables
let tasks = [];
let selectedPrio;
let category;
let selectedContacts = [];
let isAssignToDropdownActive = false;
let isCategoryDropdownActive = false;
let filteredContacts = [];
let selectedSubtasks = [];
let progress;

// Array with categories and colors
let categories = [
    {
        name: 'Development',
        color: "#FFB6C1"
    },
    {
        name: 'Design',
        color: "#FFD700"
    },
    {
        name: 'Sales',
        color: "#87CEEB"
    },
    {
        name: 'Backoffice',
        color: "#98FB98"
    },
    {
        name: 'Media',
        color: "#FFA07A"
    },
    {
        name: 'Marketing',
        color: "#FF69B4"
    },
];

// ****************
// INITIALIZE
// ****************

/**
 * Initialize the application.
 */
async function initAddTask(progressIndex) {
    await loadTasks();
    await initContactList();
    initCategories();
    progress = progressIndex;
}

/**
 * Load tasks from storage.
 */
async function loadTasks() {
    try {
        tasks = JSON.parse(await getItem("tasks"));
    } catch (e) {
        console.error("Loading error:", e);
    }
}

/**
 * Show the overlay for adding a new task.
 */
async function showAddTaskOverlay(progressIndex) {
    document.getElementById("addTaskOverlay").style.display = "flex";
    document.getElementById("addTask-close-button").style.display = "flex";
    await initAddTask(progressIndex);
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
            selectContactList.innerHTML += `
                <li id="selectContactLi-${id}" onclick="selectContact('${id}'); return false">
                    <div class="contact-initials-and-name">
                        <div class="contact_initial_image" style="background-color: ${color}">${initials}</div>
                        <span>${name}</span>
                    </div>
                    <img id="addTaskCheckbox-${id}" src="../../img/remember-unchecked.png" alt="">
                </li>
            `;
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
        setContactLiStyle(id, '#FFFFFF', '#000000', "../../img/remember-unchecked.png");
    } else { // activates selected contact
        addToSelectedContacts(id);
        setContactLiStyle(id, '#2A3647', '#FFFFFF', "../../img/remember-checked-white.png");
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
}

/**
 * Adds contact to assignment.
 * @param {string} id - The unique ID of the contact to select.
 */
function addToSelectedContacts(id) {
    selectedContacts.push(id);
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

    liElement.style.backgroundColor = bgColor;
    liElement.style.color = textColor;
    checkboxElement.src = imgSrc;
}

/**
 * Displays all contacts with their initials who are actually assignet to the task.
 */
function renderSelectedContacts() {
    let showContactsContainer = document.getElementById('addTaskShowSelectedContacts');
    if(selectedContacts.length > 0) {
        showContactsContainer.classList.remove('d-none');
        showContactsContainer.innerHTML = '';
        for (i = 0; i < selectedContacts.length; i++) {
            let id = selectedContacts[i];
            let j = getIndexByIdFromContacts(id);
            let initials = contacts[j].initials;
            let color = contacts[j].color;
            showContactsContainer.innerHTML += `
                <div class="contact_initial_image" style="background-color: ${color}; z-index: ${i + 1}; margin-left: -10px; margin-right: 0px;">${initials}</div>
            `;
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
        selectCategoryList.innerHTML += `
            <li id="selectCategoryLi-${i}" onclick="selectCategory('${i}'); return false">
                ${template}
            </li>
        `;
    };
}

/**
 * Selects the category to task.
 * @param {int} i - The index of category in categories array.
 */
function selectCategory(i) {
    category = i;
    let name = categories[i].name;
    let color = categories[i].color;
    let template = getTemplateCategory(name, color);
    let categoryDisplay = document.getElementById('addTaskCategory');
    categoryDisplay.innerHTML = '';
    categoryDisplay.innerHTML += `${template}`;
    hideCategoryList();
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

/**
 * Resets the selected prio from task.
 */
function resetDisplayCategory() {
    document.getElementById('addTaskCategory').innerHTML = '';
    document.getElementById('addTaskCategory').innerHTML = 'Select task category';
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
// function addSubtask(ev) {
//     const input = document.getElementById("subtasks-input");
//     if (ev.type === "keypress" && ev.key === "Enter") {
//       ev.preventDefault();
//     }
//     if (input.value && (ev.type === "click" || (ev.type === "keypress" && ev.key === "Enter"))) {
//       subtasks.push({ text: input.value, status: "todo" });
//       input.value = "";
//       input.focus();
//       if (ev.type === 'click') {
//         toggleSubtaskIcons();
//       }
//       renderSubtasksInForm();
//     }
//   }


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
        updateSubtasksCheckedStatus();
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
            subtaskList.innerHTML += `
                <div class="subtask" id="subtask-${i}">
                    <div>
                        <input type="checkbox" id="subtask-checkbox-${i}" ${checked}>
                        <span>${subtaskName}</span>
                    </div>
                    <img src="../../img/delete.png" alt="" onclick="deleteSubtask(${i}); return false">
                </div>
            `;
        };
    } else {
        subtaskList.classList.add('d-none');
    };    
}

/**
 * Checks, if there are any new Checks or Unchecks of subtasks and saving them to array.
 */
function updateSubtasksCheckedStatus() {
    for (i = 0; i < selectedSubtasks.length; i++) {
        try {
            let subtaskChecked = document.getElementById(`subtask-checkbox-${i}`).checked;
            if (subtaskChecked) {
                selectedSubtasks[i].done = true;
            } else {
                selectedSubtasks[i].done = false;
            };
        } catch {
            // ggf. Fehlermeldung
        };
    };
}

// ****************
// SUBMIT
// ****************

/**
 * Coordinates creating a new task and stores it to storage.
 */
async function addNewTask() {
    // Deaktiviere den Button zu Beginn der Funktion
    const createTaskButton = document.querySelector('.btn-primary[type="submit"]');
    createTaskButton.disabled = true;

    try {
        checkAddTask();
        updateSubtasksCheckedStatus();
        pushNewTaskToArray();
        await saveTasks();
        showSuccessMessage('Task succesfully created');
        resetAddTask();
    } catch (error) {
        console.error("Ein Fehler ist aufgetreten:", error);
        // Aktiviere den Button wieder, falls ein Fehler aufgetreten ist
        createTaskButton.disabled = false;
    }
}

async function saveTasks() {
    await setItem('tasks', JSON.stringify(tasks));
}

/**
 * Checks whether all required fields are filled in completely and plausibly.
 */
function checkAddTask() {
    // noch füllen für Plausibilitäten
}

/**
 * Pushes new task to task array.
 */
function pushNewTaskToArray() {
    // Variablen definieren
    let assignedTo = selectedContacts;
    let subtasks = selectedSubtasks;

    // Array füllen
    tasks.push({
        title: document.getElementById('addTaskTitle').value,
        description: document.getElementById('addTaskDescription').value,
        assignedTo: assignedTo,
        dueDate: document.getElementById('addTaskDueDate').value,
        prio: selectedPrio,
        category: category,
        subtasks: subtasks,
        progress: progress,
    });
}

// ****************
// CANCEL
// ****************

/**
 * Clears all inputs in add task form as well as temporary variables and arrays.
 */
function resetAddTask() {
    // Reset arrays
    selectedContacts = [];
    selectedSubtasks = [];

    // Reset field values
    document.getElementById('addTaskTitle').value = '';
    document.getElementById('addTaskDescription').value = '';
    document.getElementById('addTaskDueDate').value = '';
    document.getElementById('addTaskCategory').value = '';

    // Reset Variables and colors
    resetPrio();
    resetDisplayCategory();

    // Clear Lists and Dropdowns
    hideContactList();
    hideCategoryList();
    renderSubtaskList();

    initAddTask();
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
function getIndexByIdFromContacts(id) {
    for (j = 0; j < contacts.length; j++) {
        if (id == contacts[j].id) {
            return j;
        };
    };
    return -1;
}