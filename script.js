// ============================================
// PLANORA - V1
// ============================================


// ============================================
// DATA
// ============================================

let subjects = [
    "DSA",
    "DBMS",
    "Operating Systems",
    "Computer Networks"
];


let tasks = [
    {
        id: 1,
        title: "Practice Arrays",
        subject: "DSA",
        priority: "High",
        date: "2026-10-07",
        completed: false
    },

    {
        id: 2,
        title: "Revise SQL Queries",
        subject: "DBMS",
        priority: "Medium",
        date: "2026-10-08",
        completed: true
    },

    {
        id: 3,
        title: "Complete OS Notes",
        subject: "Operating Systems",
        priority: "Low",
        date: "2026-10-09",
        completed: false
    },

    {
        id: 4,
        title: "Complete CN Assignment",
        subject: "Computer Networks",
        priority: "High",
        date: "2026-10-07",
        completed: false
    }
];


let editingTaskId = null;

let activeQuickFilter = "all";


// ============================================
// HTML ELEMENTS
// ============================================

const taskList =
    document.getElementById("taskList");

const totalTasks =
    document.getElementById("totalTasks");

const pendingTasks =
    document.getElementById("pendingTasks");

const completedTasks =
    document.getElementById("completedTasks");

const currentDate =
    document.getElementById("currentDate");

const searchInput =
    document.getElementById("searchInput");

const subjectFilter =
    document.getElementById("subjectFilter");

const statusFilter =
    document.getElementById("statusFilter");

const sortFilter =
    document.getElementById("sortFilter");

const clearFiltersBtn =
    document.getElementById("clearFiltersBtn");

const addTaskBtn =
    document.getElementById("addTaskBtn");

const taskModal =
    document.getElementById("taskModal");

const closeModal =
    document.getElementById("closeModal");

const taskForm =
    document.getElementById("taskForm");

const modalTitle =
    document.getElementById("modalTitle");

const submitTaskBtn =
    document.getElementById("submitTaskBtn");

const taskSubject =
    document.getElementById("taskSubject");

const focusList =
    document.getElementById("focusList");

const upcomingList =
    document.getElementById("upcomingList");

const progressFill =
    document.getElementById("progressFill");

const progressText =
    document.getElementById("progressText");

const progressDetails =
    document.getElementById("progressDetails");

const subjectList =
    document.getElementById("subjectList");

const manageSubjectsBtn =
    document.getElementById("manageSubjectsBtn");

const subjectModal =
    document.getElementById("subjectModal");

const closeSubjectModal =
    document.getElementById("closeSubjectModal");

const subjectForm =
    document.getElementById("subjectForm");

const newSubjectInput =
    document.getElementById("newSubject");

const managedSubjectList =
    document.getElementById("managedSubjectList");

const deleteModal =
    document.getElementById("deleteModal");

const closeDeleteModal =
    document.getElementById("closeDeleteModal");

const cancelDelete =
    document.getElementById("cancelDelete");

const confirmDelete =
    document.getElementById("confirmDelete");

const subjectDeleteModal =
    document.getElementById("subjectDeleteModal");

const closeSubjectDeleteModal =
    document.getElementById("closeSubjectDeleteModal");

const cancelSubjectDelete =
    document.getElementById("cancelSubjectDelete");

const confirmSubjectDelete =
    document.getElementById("confirmSubjectDelete");

const subjectDeleteMessage =
    document.getElementById("subjectDeleteMessage");

let subjectToDelete = null;



let taskToDelete = null;

// ============================================
// DATE HELPERS
// ============================================

function getTodayString() {

    const today = new Date();

    const year = today.getFullYear();

    const month =
        String(today.getMonth() + 1).padStart(2, "0");

    const day =
        String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


function formatDate(dateString) {

    const date =
        new Date(dateString + "T00:00:00");

    return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short"
    });
}


function formatFullDate() {

    const today = new Date();

    currentDate.textContent =
        today.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });
}


function daysBetween(dateString) {

    const today =
        new Date(getTodayString() + "T00:00:00");

    const date =
        new Date(dateString + "T00:00:00");

    return Math.round(
        (date - today) / (1000 * 60 * 60 * 24)
    );
}


// ============================================
// TASK STATUS
// ============================================

function isOverdue(task) {

    return (
        !task.completed &&
        task.date < getTodayString()
    );
}


function isToday(task) {

    return task.date === getTodayString();
}


function isUpcoming(task) {

    return (
        !task.completed &&
        task.date > getTodayString()
    );
}


// ============================================
// PRIORITY
// ============================================

function priorityValue(priority) {

    if (priority === "High") return 1;

    if (priority === "Medium") return 2;

    return 3;
}


// ============================================
// SORTING
// ============================================

function sortTasks(taskArray) {

    const selectedSort =
        sortFilter.value;


    return taskArray.sort(function(a, b) {

        // Completed tasks always go last.
        if (a.completed !== b.completed) {

            return a.completed ? 1 : -1;
        }


        if (selectedSort === "date") {

            return a.date.localeCompare(b.date);
        }


        if (selectedSort === "priority") {

            return (
                priorityValue(a.priority) -
                priorityValue(b.priority)
            );
        }


        if (selectedSort === "recent") {

            return b.id - a.id;
        }


        // Default: Smart sorting
        // Priority first, then deadline.

        const priorityDifference =
            priorityValue(a.priority) -
            priorityValue(b.priority);

        if (priorityDifference !== 0) {

            return priorityDifference;
        }

        return a.date.localeCompare(b.date);
    });
}


// ============================================
// FILTERING
// ============================================

function filterTasks() {

    const searchText =
        searchInput.value
            .trim()
            .toLowerCase();

    const selectedSubject =
        subjectFilter.value;

    const selectedStatus =
        statusFilter.value;


    let filteredTasks =
        tasks.filter(function(task) {

            const matchesSearch =
                task.title
                    .toLowerCase()
                    .includes(searchText);


            const matchesSubject =
                selectedSubject === "all" ||
                task.subject === selectedSubject;


            let matchesStatus = true;


            if (selectedStatus === "pending") {

                matchesStatus =
                    !task.completed;
            }


            if (selectedStatus === "completed") {

                matchesStatus =
                    task.completed;
            }


            let matchesQuickFilter = true;


            if (activeQuickFilter === "today") {

                matchesQuickFilter =
                    isToday(task) &&
                    !task.completed;
            }


            if (activeQuickFilter === "upcoming") {

                matchesQuickFilter =
                    isUpcoming(task);
            }


            if (activeQuickFilter === "overdue") {

                matchesQuickFilter =
                    isOverdue(task);
            }


            if (activeQuickFilter === "completed") {

                matchesQuickFilter =
                    task.completed;
            }


            return (
                matchesSearch &&
                matchesSubject &&
                matchesStatus &&
                matchesQuickFilter
            );

        });


    return sortTasks(filteredTasks);
}


// ============================================
// DISPLAY TASKS
// ============================================

function displayTasks() {

    const filteredTasks =
        filterTasks();


    taskList.innerHTML = "";


    if (filteredTasks.length === 0) {

        taskList.innerHTML = `
            <div class="empty-state">
                No tasks found for the selected filters.
            </div>
        `;

        return;
    }


    filteredTasks.forEach(function(task) {

        const card =
            document.createElement("div");

        card.className = "task-card";


        if (task.completed) {

            card.classList.add("completed");
        }


        const overdueLabel =
            isOverdue(task)
                ? `<span class="overdue">OVERDUE</span>`
                : "";


        card.innerHTML = `

            <div class="task-left">

                <button
                    class="complete-btn"
                    data-id="${task.id}"
                    aria-label="Complete task">
                </button>


                <div class="task-info">

                    <h3>${escapeHTML(task.title)}</h3>

                    <div class="task-meta">

                        ${escapeHTML(task.subject)}
                        · Due ${formatDate(task.date)}

                    </div>

                </div>

            </div>


            <div class="task-right">

                ${overdueLabel}

                <span class="priority ${task.priority.toLowerCase()}">
                    ${task.priority}
                </span>

                <button
                    class="edit-btn"
                    data-id="${task.id}"
                    aria-label="Edit task">
                    Edit
                </button>

                <button
                    class="delete-btn"
                    data-id="${task.id}"
                    aria-label="Delete task">
                    ×
                </button>

            </div>
        `;


        taskList.appendChild(card);
    });


    addTaskListeners();
}


// ============================================
// ESCAPE HTML
// ============================================

function escapeHTML(value) {

    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// ============================================
// TASK BUTTONS
// ============================================

function addTaskListeners() {

    document
        .querySelectorAll(".complete-btn")
        .forEach(function(button) {

            button.addEventListener(
                "click",
                function() {

                    const id =
                        Number(button.dataset.id);

                    const task =
                        tasks.find(function(item) {

                            return item.id === id;
                        });


                    if (task) {

                        task.completed =
                            !task.completed;
                    }


                    refreshEverything();
                }
            );
        });


    document
        .querySelectorAll(".delete-btn")
        .forEach(function(button) {

            button.addEventListener(
                "click",
                function() {

                    taskToDelete =
                        Number(button.dataset.id);

                    deleteModal.classList.add("show");
                }
            );
        });


    document
        .querySelectorAll(".edit-btn")
        .forEach(function(button) {

            button.addEventListener(
                "click",
                function() {

                    const id =
                        Number(button.dataset.id);

                    openEditTask(id);
                }
            );
        });
}

// ============================================
// DELETE CONFIRMATION
// ============================================

function closeDeleteConfirmation() {

    deleteModal.classList.remove("show");

    taskToDelete = null;
}


closeDeleteModal.addEventListener(
    "click",
    closeDeleteConfirmation
);


cancelDelete.addEventListener(
    "click",
    closeDeleteConfirmation
);


confirmDelete.addEventListener(
    "click",
    function() {

        if (taskToDelete === null) {
            return;
        }


        tasks =
            tasks.filter(function(task) {

                return task.id !== taskToDelete;
            });


        closeDeleteConfirmation();

        refreshEverything();
    }
);


deleteModal.addEventListener(
    "click",
    function(event) {

        if (event.target === deleteModal) {

            closeDeleteConfirmation();
        }
    }
);

// ============================================
// STATISTICS
// ============================================

function updateStatistics() {

    const total =
        tasks.length;


    const completed =
        tasks.filter(function(task) {

            return task.completed;

        }).length;


    const pending =
        total - completed;


    totalTasks.textContent = total;

    pendingTasks.textContent = pending;

    completedTasks.textContent = completed;
}


// ============================================
// PROGRESS
// ============================================

function updateProgress() {

    const total =
        tasks.length;


    const completed =
        tasks.filter(function(task) {

            return task.completed;

        }).length;


    const percentage =
        total === 0
            ? 0
            : Math.round((completed / total) * 100);


    progressText.textContent =
        `${percentage}%`;


    progressFill.style.width =
        `${percentage}%`;


    progressDetails.textContent =
        `${completed} of ${total} tasks completed`;
}


// ============================================
// TODAY'S FOCUS
// ============================================

function displayFocus() {

        // Today's Focus shows the 3 most important
        // pending tasks based on priority and deadline.

        const pendingTasks =
            tasks.filter(function (task) {
                return !task.completed;
            });


        const focusTasks =
            sortTasks(pendingTasks.slice()).slice(0, 3);


        focusList.innerHTML = "";


        if (focusTasks.length === 0) {

            focusList.innerHTML = `
            <div class="focus-empty">
                You're all caught up.
                No pending tasks.
            </div>
        `;

            return;
        }


        focusTasks.forEach(function (task, index) {

            const card =
                document.createElement("div");

            card.className = "focus-card";


            let deadlineText;

            const days =
                daysBetween(task.date);


            if (isOverdue(task)) {

                deadlineText = "Overdue";

            } else if (days === 0) {

                deadlineText = "Due today";

            } else if (days === 1) {

                deadlineText = "Due tomorrow";

            } else {

                deadlineText = `Due in ${days} days`;
            }


            card.innerHTML = `

            <div class="focus-number">
                FOCUS ${index + 1}
            </div>

            <h3>
                ${escapeHTML(task.title)}
            </h3>

            <div class="focus-meta">
                ${escapeHTML(task.subject)}
                · ${task.priority}
                · ${deadlineText}
            </div>
        `;


            focusList.appendChild(card);
        });


        // Store the IDs so Upcoming Deadlines
        // can avoid showing the same tasks.
        return focusTasks.map(function (task) {
            return task.id;
        });
}

// ============================================
// UPCOMING DEADLINES
// ============================================

function displayUpcoming() {

    const pendingTasks =
        tasks.filter(function(task) {

            return (
                !task.completed &&
                task.date > getTodayString()
            );

        });


    const focusTasks =
        sortTasks(
            tasks.filter(function(task) {
                return !task.completed;
            }).slice()
        ).slice(0, 3);


    const focusIds =
        focusTasks.map(function(task) {
            return task.id;
        });


    const upcoming =
        pendingTasks
            .filter(function(task) {

                return !focusIds.includes(task.id);

            })
            .sort(function(a, b) {

                return a.date.localeCompare(b.date);

            })
            .slice(0, 5);


    upcomingList.innerHTML = "";


    if (upcoming.length === 0) {

        upcomingList.innerHTML = `
            <div class="empty-state">
                No additional upcoming deadlines.
            </div>
        `;

        return;
    }


    upcoming.forEach(function(task) {

        const card =
            document.createElement("div");

        card.className = "upcoming-card";


        const days =
            daysBetween(task.date);


        let daysText;


        if (days === 1) {

            daysText = "Tomorrow";

        } else {

            daysText = `${days} days`;
        }


        card.innerHTML = `

            <div>

                <div class="upcoming-title">
                    ${escapeHTML(task.title)}
                </div>

                <div class="upcoming-meta">
                    ${escapeHTML(task.subject)}
                    · ${formatDate(task.date)}
                </div>

            </div>

            <div class="days-left">
                ${daysText}
            </div>
        `;


        upcomingList.appendChild(card);
    });
}


// ============================================
// SUBJECT DROPDOWNS
// ============================================

function updateSubjectDropdowns() {

    const currentFilter =
        subjectFilter.value;

    const currentTaskSubject =
        taskSubject.value;


    subjectFilter.innerHTML =
        `<option value="all">All Subjects</option>`;


    taskSubject.innerHTML =
        `<option value="">Select subject</option>`;


    subjects.forEach(function(subject) {

        subjectFilter.innerHTML += `
            <option value="${escapeHTML(subject)}">
                ${escapeHTML(subject)}
            </option>
        `;


        taskSubject.innerHTML += `
            <option value="${escapeHTML(subject)}">
                ${escapeHTML(subject)}
            </option>
        `;
    });


    if (
        subjects.includes(currentFilter)
    ) {

        subjectFilter.value =
            currentFilter;
    }


    if (
        subjects.includes(currentTaskSubject)
    ) {

        taskSubject.value =
            currentTaskSubject;
    }
}


// ============================================
// DISPLAY SUBJECTS
// ============================================

function displaySubjects() {

    subjectList.innerHTML = "";


    if (subjects.length === 0) {

        subjectList.innerHTML = `
            <div class="empty-state">
                No subjects added yet.
            </div>
        `;

        return;
    }


    subjects.forEach(function(subject) {

        const taskCount =
            tasks.filter(function(task) {

                return task.subject === subject;

            }).length;


        const card =
            document.createElement("div");

        card.className =
            "subject-card";


        card.innerHTML = `
            ${escapeHTML(subject)}
            <span>(${taskCount} tasks)</span>
        `;


        subjectList.appendChild(card);
    });
}


// ============================================
// SUBJECT MANAGEMENT
// ============================================

function displayManagedSubjects() {

    managedSubjectList.innerHTML = "";


    if (subjects.length === 0) {

        managedSubjectList.innerHTML = `
            <p class="subject-empty">
                No subjects added yet.
            </p>
        `;

        return;
    }


    subjects.forEach(function(subject) {

        const row =
            document.createElement("div");

        row.className =
            "managed-subject-item";


        row.innerHTML = `

            <span>
                ${escapeHTML(subject)}
            </span>

            <button
                class="remove-subject-btn"
                data-subject="${escapeHTML(subject)}"
                title="Remove subject">
                Remove
            </button>

        `;


        managedSubjectList.appendChild(row);
    });


    // Add delete confirmation to each subject
    // after the buttons have been created.

    document
        .querySelectorAll(".remove-subject-btn")
        .forEach(function(button) {

            button.addEventListener(
                "click",
                function() {

                    const subject =
                        button.dataset.subject;


                    const taskCount =
                        tasks.filter(function(task) {

                            return task.subject === subject;

                        }).length;


                    subjectToDelete =
                        subject;


                    if (taskCount > 0) {

                        subjectDeleteMessage.textContent =
                            `"${subject}" has ${taskCount} task${taskCount === 1 ? "" : "s"} assigned to it. Reassign or delete those tasks before removing this subject.`;

                        confirmSubjectDelete.style.display =
                            "none";

                    } else {

                        subjectDeleteMessage.textContent =
                            `Are you sure you want to remove "${subject}"? This action cannot be undone.`;

                        confirmSubjectDelete.style.display =
                            "block";
                    }


                    subjectDeleteModal.classList.add("show");
                }
            );
        });
}


// ============================================
// ADD SUBJECT
// ============================================

subjectForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        const subject =
            newSubjectInput.value.trim();


        if (!subject) {
            return;
        }


        const alreadyExists =
            subjects.some(function(item) {

                return item.toLowerCase() ===
                    subject.toLowerCase();
            });


        if (alreadyExists) {

            alert("This subject already exists.");

            return;
        }


        subjects.push(subject);

        subjects.sort();


        newSubjectInput.value = "";


        updateSubjectDropdowns();

        displayManagedSubjects();

        displaySubjects();
    }
);


// ============================================
// TASK MODAL
// ============================================

function openAddTask() {

    editingTaskId = null;


    modalTitle.textContent =
        "Add New Task";


    submitTaskBtn.textContent =
        "Add Task";


    taskForm.reset();


    taskModal.classList.add("show");
}


function openEditTask(id) {

    const task =
        tasks.find(function(item) {

            return item.id === id;
        });


    if (!task) {
        return;
    }


    editingTaskId = id;


    modalTitle.textContent =
        "Edit Task";


    submitTaskBtn.textContent =
        "Save Changes";


    document.getElementById("taskTitle").value =
        task.title;


    taskSubject.value =
        task.subject;


    document.getElementById("taskPriority").value =
        task.priority;


    document.getElementById("taskDate").value =
        task.date;


    taskModal.classList.add("show");
}


addTaskBtn.addEventListener(
    "click",
    openAddTask
);


closeModal.addEventListener(
    "click",
    function() {

        taskModal.classList.remove("show");
    }
);


// ============================================
// ADD / EDIT TASK
// ============================================

taskForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        const title =
            document
                .getElementById("taskTitle")
                .value
                .trim();


        const subject =
            taskSubject.value;


        const priority =
            document
                .getElementById("taskPriority")
                .value;


        const date =
            document
                .getElementById("taskDate")
                .value;


        if (
            !title ||
            !subject ||
            !priority ||
            !date
        ) {

            alert("Please fill in all fields.");

            return;
        }


        if (editingTaskId !== null) {

            const task =
                tasks.find(function(item) {

                    return item.id === editingTaskId;
                });


            if (task) {

                task.title = title;

                task.subject = subject;

                task.priority = priority;

                task.date = date;
            }

        }
        else {

            tasks.push({

                id: Date.now(),

                title: title,

                subject: subject,

                priority: priority,

                date: date,

                completed: false

            });
        }


        taskForm.reset();

        taskModal.classList.remove("show");

        editingTaskId = null;


        refreshEverything();
    }
);


// ============================================
// CLEAR FILTERS
// ============================================

function clearFilters() {

    searchInput.value = "";

    subjectFilter.value = "all";

    statusFilter.value = "all";

    sortFilter.value = "smart";


    activeQuickFilter = "all";


    document
        .querySelectorAll(".quick-filter")
        .forEach(function(button) {

            button.classList.remove("active");
        });


    document
        .querySelector('[data-filter="all"]')
        .classList.add("active");


    displayTasks();
}


clearFiltersBtn.addEventListener(
    "click",
    clearFilters
);


// ============================================
// QUICK FILTERS
// ============================================

document
    .querySelectorAll(".quick-filter")
    .forEach(function(button) {

        button.addEventListener(
            "click",
            function() {

                document
                    .querySelectorAll(".quick-filter")
                    .forEach(function(item) {

                        item.classList.remove("active");
                    });


                button.classList.add("active");


                activeQuickFilter =
                    button.dataset.filter;


                displayTasks();
            }
        );
    });


// ============================================
// FILTER EVENTS
// ============================================

searchInput.addEventListener(
    "input",
    displayTasks
);


subjectFilter.addEventListener(
    "change",
    displayTasks
);


statusFilter.addEventListener(
    "change",
    displayTasks
);


sortFilter.addEventListener(
    "change",
    displayTasks
);


// ============================================
// SUBJECT MODAL
// ============================================

manageSubjectsBtn.addEventListener(
    "click",
    function() {

        displayManagedSubjects();

        subjectModal.classList.add("show");
    }
);


closeSubjectModal.addEventListener(
    "click",
    function() {

        subjectModal.classList.remove("show");
    }
);


// ============================================
// CLOSE MODALS WHEN CLICKING OUTSIDE
// ============================================

taskModal.addEventListener(
    "click",
    function(event) {

        if (event.target === taskModal) {

            taskModal.classList.remove("show");
        }
    }
);


subjectModal.addEventListener(
    "click",
    function(event) {

        if (event.target === subjectModal) {

            subjectModal.classList.remove("show");
        }
    }
);

// ============================================
// SUBJECT DELETE CONFIRMATION
// ============================================

function closeSubjectDeleteConfirmation() {

    subjectDeleteModal.classList.remove("show");

    subjectToDelete = null;

    confirmSubjectDelete.style.display =
        "block";
}


closeSubjectDeleteModal.addEventListener(
    "click",
    closeSubjectDeleteConfirmation
);


cancelSubjectDelete.addEventListener(
    "click",
    closeSubjectDeleteConfirmation
);


confirmSubjectDelete.addEventListener(
    "click",
    function() {

        if (!subjectToDelete) {
            return;
        }


        const hasTasks =
            tasks.some(function(task) {

                return task.subject === subjectToDelete;
            });


        // Extra safety check.
        if (hasTasks) {
            return;
        }


        subjects =
            subjects.filter(function(subject) {

                return subject !== subjectToDelete;
            });


        closeSubjectDeleteConfirmation();


        updateSubjectDropdowns();

        displayManagedSubjects();

        displaySubjects();

        displayTasks();
    }
);


subjectDeleteModal.addEventListener(
    "click",
    function(event) {

        if (event.target === subjectDeleteModal) {

            closeSubjectDeleteConfirmation();
        }
    }
);
// ============================================
// REFRESH EVERYTHING
// ============================================

function refreshEverything() {

    displayTasks();

    updateStatistics();

    updateProgress();

    displayFocus();

    displayUpcoming();

    displaySubjects();

    updateSubjectDropdowns();
}


// ============================================
// INITIALIZE
// ============================================

formatFullDate();

updateSubjectDropdowns();

refreshEverything();