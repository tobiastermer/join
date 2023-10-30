let tasks = [];
let selectedPrio
let selectedContacts = [];
let isAssignToDropdownActive = false;
let isCategoryDropdownActive = false;
let filteredContacts = [];
let selectedSubtasks = [];
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
let category;

async function showAddTaskOverlay() {
    document.getElementById("addTaskOverlay").style.display = "flex";
    document.getElementById("addTask-close-button").style.display = "flex";
    await initAddTask();
}

function closeAddTaskOverlay() {
    document.getElementById("addTaskOverlay").style.display = "none";
    document.getElementById("addTask-close-button").style.display = "none";
}

async function initAddTask() {
    await loadTasks();
    await initContactList();
    initCategories();
}

async function loadTasks() {
    try {
        tasks = JSON.parse(await getItem("tasks"));
    } catch (e) {
        console.error("Loading error:", e);
    }
}

async function initContactList() {
    await loadContactsForTasks();
    // filterContacts();
    selectedContacts = [];
    renderContactList();
    renderSelectedContacts();
}

async function loadContactsForTasks() {
    try {
        contacts = JSON.parse(await getItem("contacts"));
    } catch (e) {
        console.error("Loading error:", e);
    }
}

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

function showContactList() {
    if (isAssignToDropdownActive) {
        isAssignToDropdownActive = false;
        document.getElementById('addTaskListContactsContainer').classList.add('d-none');
        document.getElementById('addTaskImgDropdownContacts').src = '../../img/dropdown_down.png'
    } else {
        isAssignToDropdownActive = true;
        document.getElementById('addTaskListContactsContainer').classList.remove('d-none');
        document.getElementById('addTaskImgDropdownContacts').src = '../../img/dropdown_up.png'
    };
}

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

function isIdInSelectedContacts(id) {
    return selectedContacts.includes(id);
}

function removeFromSelectedContacts(id) {
    let i = selectedContacts.indexOf(id);
    selectedContacts.splice(i, 1);
}

function addToSelectedContacts(id) {
    selectedContacts.push(id);
}

function setContactLiStyle(id, bgColor, textColor, imgSrc) {
    // let i = getIndexById(id, selectedContacts); //ggf. löschen
    let liElement = document.getElementById(`selectContactLi-${id}`);
    let checkboxElement = document.getElementById(`addTaskCheckbox-${id}`);

    liElement.style.backgroundColor = bgColor;
    liElement.style.color = textColor;
    checkboxElement.src = imgSrc;
}

function renderSelectedContacts() {
    let showContactsContainer = document.getElementById('addTaskShowSelectedContacts');
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
}

function getIndexById(id, array) {
    return array.indexOf(id);
}

function getIndexByIdFromContacts(id) {
    for (j = 0; j < contacts.length; j++) {
        if (id == contacts[j].id) {
            return j;
        };
    };
    return -1;
}

// ****************
// CATEGORIES

function initCategories() {
    renderCategoryList();
}

function showCategoryList() {
    if (isCategoryDropdownActive) {
        isCategoryDropdownActive = false;
        document.getElementById('addTaskListCategoriesContainer').classList.add('d-none');
        document.getElementById('addTaskImgDropdownCategory').src = '../../img/dropdown_down.png'
    } else {
        isCategoryDropdownActive = true;
        document.getElementById('addTaskListCategoriesContainer').classList.remove('d-none');
        document.getElementById('addTaskImgDropdownCategory').src = '../../img/dropdown_up.png'
    };
}

function renderCategoryList() {
    let selectCategoryList = document.getElementById('addTaskListCategories');
    selectCategoryList.innerHTML = '';
    for (let i = 0; i < categories.length; i++) {
        let name = categories[i].name;
        let color = categories[i].color;
        selectCategoryList.innerHTML += `
            <li id="selectCategoryLi-${i}" onclick="selectCategory('${i}'); return false">
                <div class="category-color-and-name">
                    <div class="category_color" style="background-color: ${color}"></div>
                    <span>${name}</span>
                </div>
            </li>
        `;
    };
}

function selectCategory(i) {
    category = i;
    let addTaskCategory = document.getElementById('addTaskCategory');
    addTaskCategory.innerHTML = '';
    
}

// ****************
// SUBTASKS

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

function deleteSubtask(i) {
    selectedSubtasks.splice(i, 1);
    renderSubtaskList();
}

function renderSubtaskList() {
    let subtaskList = document.getElementById('addTaskSubtaskList');
    updateSubtasksCheckedStatus();
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
}

// updates Checked Status
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

function resetAddTask() {
    document.getElementById('addTaskTitle').value = '';
    document.getElementById('addTaskDescription').value = '';
    selectedContacts = [];
    document.getElementById('addTaskDueDate').value = '';
    resetPrio();
    document.getElementById('addTaskCategory').value = '';
    selectedSubtasks = [];
    renderSubtaskList();
    initAddTask();
}

async function addNewTask() {
    checkAddTask(); // noch mit Leben füllen / Plausis ergänzen
    updateSubtasksCheckedStatus();
    pushNewTaskToArray();
    await setItem('tasks', JSON.stringify(tasks));
    resetAddTask();
}

function checkAddTask() {
    // noch füllen
}

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
        category: document.getElementById('addTaskCategory').value,
        subtasks: subtasks,
    });
}

function setPrio(prio) {

    // reset active class from ass task form
    resetPrio();

    // Add 'active' class to the selected button
    selectedPrio = prio;
    if (selectedPrio !== '') {
        document.getElementById(`img-prio-${prio}`).classList.add(`prio-${prio}-active`);
        document.getElementById(`btn-prio-${prio}`).classList.add(`bg-prio-${prio}-active`);
    };

}

function resetPrio() {
    selectedPrio = '';
    // Remove 'active' class from all buttons
    const prios = ['high', 'med', 'low'];
    prios.forEach(p => {
        document.getElementById(`img-prio-${p}`).classList.remove(`prio-${p}-active`);
        document.getElementById(`btn-prio-${p}`).classList.remove(`bg-prio-${p}-active`);
    });
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
    showSuccessMessage();
}
