let tasks = [];
let selectedPrio

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
    await initContacts();
}

async function initContacts() {

    // await loadContacts();
    contacts = JSON.parse(await getItem("contacts"));


    let selectContact = document.getElementById('addTaskSelectContacts');

    if (contacts.length > 0) {
        for (let i = 0; i < contacts.length; i++) {
            let id = i + 1;
            let name = contacts[i].name;
            let initials = contacts[i].initials;
            let color = contacts[i].color;
            document.getElementById('addTaskSelectContacts').innerHTML += `
                <option value="${id}">${name}</option>
            `;
        };
    };

    // + neuen Kontakt anlegen

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
