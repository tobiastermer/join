let tasks = [];

function showAddTaskOverlay() {
    document.getElementById("addTaskOverlay").style.display = "flex";
    document.getElementById("addTask-close-button").style.display = "flex";
}

function closeAddTaskOverlay() {
    document.getElementById("addTaskOverlay").style.display = "none";
    document.getElementById("addTask-close-button").style.display = "none";
}
function addNewTask() {

    let title = document.getElementById('addTaskTitle').value
    let description = document.getElementById('addTaskDescription').value
    // assigned to noch ergänzen
    let dueDate = document.getElementById('addTaskDueDate').value

}

function setPrio(prio) {
    // List of possible priorities
    const prios = ['high', 'med', 'low'];

    // Remove 'active' class from all buttons
    prios.forEach(p => {
        document.getElementById(`img-prio-${p}`).classList.remove(`prio-${p}-active`);
        document.getElementById(`btn-prio-${p}`).classList.remove(`bg-prio-${p}-active`);
    });

    // Add 'active' class to the selected button
    document.getElementById(`img-prio-${prio}`).classList.add(`prio-${prio}-active`);
    document.getElementById(`btn-prio-${prio}`).classList.add(`bg-prio-${prio}-active`);
}

