let tasks = [];
let selectedPrio
let selectedContacts = [];
let isAssignToDropdownActive = false;
let filteredContacts = [];

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
    await initContactList();

}

async function initContactList() {

    await loadContactsForTasks();
    // filterContacts();
    selectedContacts = [];
    let selectContactList = document.getElementById('addTaskListContacts');
    selectContactList.innerHTML = '';

    if (contacts.length > 0) {
        for (let i = 0; i < contacts.length; i++) {
            let id = i; // let id = i + 1;
            let name = contacts[i].name;
            let initials = contacts[i].initials;
            let color = contacts[i].color;
            selectContactList.innerHTML += `
                <li id="selectContactLi-${id}" onclick="selectContact(${id}); return false">
                    <div class="contact-initials-and-name">
                        <div class="contact_initial_image" style="background-color: ${color}">${initials}</div>
                        <span>${name}</span>
                    </div>
                    <img id="addTaskCheckbox-${id}" src="../../img/remember-unchecked.png" alt="">
                </li>
            `;
        };
    };

    // + neuen Kontakt anlegen

}

async function loadContactsForTasks() {
    contacts = JSON.parse(await getItem("contacts"));
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
    if(isAssignToDropdownActive) {
        isAssignToDropdownActive = false;
        document.getElementById('addTaskListContacts').classList.add('d-none');
        document.getElementById('addTaskImgDropdown').src = '../../img/dropdown_down.png'
    } else {
        isAssignToDropdownActive = true;
        document.getElementById('addTaskListContacts').classList.remove('d-none');
        document.getElementById('addTaskImgDropdown').src = '../../img/dropdown_up.png'
    };
}

function selectContact(id) {
    if (isIdInSelectedContacts(id)) {
        removeFromSelectedContacts(id);
        setContactLiStyle(id, '#FFFFFF', '#000000', "../../img/remember-unchecked.png");
    } else {
        addToSelectedContacts(id);
        setContactLiStyle(id, '#2A3647', '#FFFFFF', "../../img/remember-checked-white.png");
    }
    showSelectedContacts();
}

function isIdInSelectedContacts(id) {
    return selectedContacts.includes(id);
}

function removeFromSelectedContacts(id) {
    let index = selectedContacts.indexOf(id);
    selectedContacts.splice(index, 1);
}

function addToSelectedContacts(id) {
    selectedContacts.push(id);
}

function setContactLiStyle(id, bgColor, textColor, imgSrc) {
    let liElement = document.getElementById(`selectContactLi-${id}`);
    let checkboxElement = document.getElementById(`addTaskCheckbox-${id}`);

    liElement.style.backgroundColor = bgColor;
    liElement.style.color = textColor;
    checkboxElement.src = imgSrc;
}

function showSelectedContacts() {
    let showContactsContainer = document.getElementById('addTaskShowSelectedContacts');
    showContactsContainer.innerHTML = '';
    for (i = 0; i < selectedContacts.length; i++) {
        let initials = contacts[selectedContacts[i]].initials;
        let color = contacts[selectedContacts[i]].color;
        showContactsContainer.innerHTML += `
            <div class="contact_initial_image" style="background-color: ${color}; z-index: ${i+1}; margin-left: -10px; margin-right: 0px;">${initials}</div>
        `;
    };
}

function cancelAddTask() {
    document.getElementById('addTaskTitle').value = '';
    document.getElementById('addTaskDescription').value = '';
    // assigned to noch ergänzen
    document.getElementById('addTaskDueDate').value = '';
    resetPrio();
    document.getElementById('addTaskCategory').value = '';
    // Subtasks to noch ergänzen

}

function addNewTask() {

    let subtasks = [];
    let assignedTo = [];

    // Plausis ergänzen

    // Variablen definieren
    let title = document.getElementById('addTaskTitle').value;
    let description = document.getElementById('addTaskDescription').value;
    // assigned to noch ergänzen
    let dueDate = document.getElementById('addTaskDueDate').value;
    let prio = selectedPrio;
    let category = document.getElementById('addTaskCategory').value;
    // Subtasks to noch ergänzen


    tasks.push({
        title: title,
        description: description,
        dueDate: dueDate,
        prio: prio,
        category: category,
    });

    console.log(tasks);

    // hier noch auf den Server laden

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
