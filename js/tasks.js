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

    document.getElementById(`btn-prio-${prio}`).style.backgroundColor = ''

}