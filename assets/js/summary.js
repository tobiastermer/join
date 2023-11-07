/**
 * Initializes the summary/dashboard area by loading tasks and rendering the summary.
 * @async
 */
async function initSummary() {
    await loadTasks();
    renderSummary();
}

/**
 * Renders the summary by updating the KPI elements with the corresponding values.
 */
function renderSummary() {
    document.getElementById('summary-kpi-todo').innerHTML = getAmountTasksPerProgress(0);
    document.getElementById('summary-kpi-done').innerHTML = getAmountTasksPerProgress(3);
    document.getElementById('summary-kpi-urgent').innerHTML = getAmountTasksPerPrio('high');
    document.getElementById('summary-kpi-deadline').innerHTML = getEarliestDueDateWithPriority();
    document.getElementById('summary-kpi-tasksInBoard').innerHTML = globalTasks.length;
    document.getElementById('summary-kpi-progress').innerHTML = getAmountTasksPerProgress(1);
    document.getElementById('summary-kpi-feedback').innerHTML = getAmountTasksPerProgress(2);
}

/**
 * Returns the number of tasks with the specified progress index.
 * @param {number} progressIndex - The progress index to filter tasks by.
 * @returns {number} The number of tasks matching the specified progress index.
 */
function getAmountTasksPerProgress(progressIndex) {
    return globalTasks.filter(task => task.progress === progressIndex).length;
}

/**
 * Returns the number of tasks with the specified priority.
 * @param {string} prio - The priority to filter tasks by (e.g., 'high').
 * @returns {number} The number of tasks matching the specified priority.
 */
function getAmountTasksPerPrio(prio) {
    return globalTasks.filter(task => task.prio === prio).length;
}

/**
 * Gets the earliest due date among tasks with a progress of 0, 1, or 2.
 * @returns {string} The earliest due date in formatted string or 'No task found' if no tasks match the criteria.
 */
function getEarliestDueDateWithPriority() {
    let filteredTasks = globalTasks.filter(task => [0, 1, 2].includes(task.progress));

    if (filteredTasks.length === 0) {
        return 'No task found';
    }

    filteredTasks.sort((task1, task2) => {
        if (task1.prio === 'high' && task2.prio !== 'high') {
            return -1;
        } else if (task1.prio !== 'high' && task2.prio === 'high') {
            return 1;
        }

        let date1 = new Date(task1.dueDate);
        let date2 = new Date(task2.dueDate);

        return date1 - date2;
    });

    let earliestTask = filteredTasks[0];
    let formattedDate = changeDateFormat(earliestTask.dueDate);
    return formattedDate;
}

/**
 * Converts a date string into the format "Month Day, Year".
 * @param {string} date - The date string to format.
 * @returns {string} The formatted date string.
 */
function changeDateFormat(date) {
    // Datum ins gewünschte Format umwandeln
    let dateObj = new Date(date);
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];
    let formattedDate = `${monthNames[dateObj.getMonth()]} ${dateObj.getDate()}, ${dateObj.getFullYear()}`;
    return formattedDate;
}