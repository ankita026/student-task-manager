
// 1. Get the elements from our HTML
const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const emptyMessage = document.getElementById("empty-message");

const totalCount = document.getElementById("total-count");
const pendingCount = document.getElementById("pending-count");
const completedCount = document.getElementById("completed-count");

const filterButtons = document.querySelectorAll("[data-filter]");

// 2. Store our tasks
let tasks = [];
let currentFilter = "all";

// 3. Add a new task
taskForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const taskName = taskInput.value.trim();

    if (taskName === "") {
        alert("Please enter a task name!");
        return;
    }

    const task = {
        id: Date.now(),
        name: taskName,
        completed: false
    };

    tasks.push(task);

    taskInput.value = "";

    renderTasks();
});

// 4. Display tasks on the page
function renderTasks() {
    taskList.replaceChildren();

    const visibleTasks = tasks.filter(function (task) {
        if (currentFilter === "pending") {
            return !task.completed;
        }

        if (currentFilter === "completed") {
            return task.completed;
        }

        return true;
    });

    visibleTasks.forEach(function (task) {
        const listItem = document.createElement("li");
        listItem.className = "task-item";

        if (task.completed) {
            listItem.classList.add("completed");
        }

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.setAttribute(
            "aria-label",
            "Mark " + task.name + " as completed"
        );

        checkbox.addEventListener("change", function () {
            task.completed = checkbox.checked;
            renderTasks();
        });

        const taskText = document.createElement("span");
        taskText.textContent = task.name;

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-button";
        deleteButton.type = "button";

        deleteButton.addEventListener("click", function () {
            tasks = tasks.filter(function (item) {
                return item.id !== task.id;
            });

            renderTasks();
        });

        listItem.append(checkbox, taskText, deleteButton);
        taskList.appendChild(listItem);
    });

    
    // 5. Update the task counters
    const completedTasks = tasks.filter(function (task) {
        return task.completed;
    }).length;

    const pendingTasks = tasks.length - completedTasks;

    totalCount.textContent = tasks.length;
    pendingCount.textContent = pendingTasks;
    completedCount.textContent = completedTasks;

    // 6. Calculate study progress
    const percentage = tasks.length === 0
        ? 0
        : Math.round((completedTasks / tasks.length) * 100);

    const progressPercent = document.getElementById("completion-percent");
    const progressFill = document.getElementById("progress-fill");
    const progressTrack = document.getElementById("progress-track");
    const progressNote = document.getElementById("progress-note");

    progressPercent.textContent = percentage + "%";
    progressFill.style.width = percentage + "%";
    progressTrack.setAttribute("aria-valuenow", percentage);

    if (tasks.length === 0) {
        progressNote.textContent = "Start by adding your first task.";
    } else if (percentage === 100) {
        progressNote.textContent = "Amazing! You've completed every task.";
    } else {
        progressNote.textContent =
            completedTasks + " of " + tasks.length + " tasks completed.";
    }


    // 6. Show or hide the empty message
    emptyMessage.hidden = visibleTasks.length > 0;
}

// 7. Handle the All, Pending and Completed filters
filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        currentFilter = button.dataset.filter;

        filterButtons.forEach(function (item) {
            item.classList.remove("active");
        });

        button.classList.add("active");

        renderTasks();
    });
});

// 8. Display the initial empty task list
renderTasks();
