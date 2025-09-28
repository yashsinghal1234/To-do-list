let input = document.querySelector('#enter')
let addbtn = document.querySelector('#addbtn')
let msg = document.querySelector('.msg')
let checkbtn = document.querySelector('#check-task')
let cont = document.querySelector('.container')
let showcont = document.querySelector('.showTask-container')
let addshowbtn = document.querySelector('#addtask')
let taskcont = document.querySelector('.tasks')
let clearAllbtn = document.querySelector('#clearAlltask')
let clearmsg = document.querySelector(".clearmsg")
let loginbtn = document.querySelector('#loginbtn')
let currentuser = ""
let inputname = document.querySelector('#username')
let loginContainer = document.querySelector('.login-container')
let tasksmsg = document.querySelector('#tasksmsg')
let userDisplay = document.querySelector('#user-display')
let currentUserName = document.querySelector('#current-user-name')
let currentDateEl = document.querySelector('#current-date')
let prioritySelect = document.querySelector('#priority-select')
let filterSelect = document.querySelector('#filter-select')
let deadlineInput = document.querySelector('#deadline-input')
let notifyCheckbox = document.querySelector('#notify-checkbox')
let totalTasksEl = document.querySelector('#total-tasks')
let completedTasksEl = document.querySelector('#completed-tasks')
let pendingTasksEl = document.querySelector('#pending-tasks')
let progressFill = document.querySelector('#progress-fill')
let progressText = document.querySelector('#progress-text')
let logoutBtn = document.querySelector('#logout-btn')

// Initialize
showcont.classList.add('hide2')
cont.classList.add('hide1')

// Set current date
function setCurrentDate() {
    const now = new Date()
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }
    currentDateEl.textContent = now.toLocaleDateString('en-US', options)
}

setCurrentDate()

loginbtn.addEventListener('click', function () {
    let name = inputname.value.trim()
    if (!name) {
        showNotification("Please enter a valid name", "error")
        return
    }
    currentuser = name
    if (!localStorage.getItem(currentuser)) {
        localStorage.setItem(currentuser, JSON.stringify([]))
    }

    // Update UI
    currentUserName.textContent = name
    userDisplay.classList.remove('hidden')
    loginContainer.classList.add('hide3')
    cont.classList.remove('hide1')

    // Migrate old tasks if needed
    migrateTasks()

    showNotification(`Welcome back, ${name}!`, "success")
})

addbtn.addEventListener('click', function () {
    if (input.value.trim() === "") {
        showNotification("Please enter a valid task", "error")
        return;
    }

    const tasks = JSON.parse(localStorage.getItem(currentuser))
    const newTask = {
        id: Date.now(),
        text: input.value.trim(),
        priority: prioritySelect.value,
        completed: false,
        createdAt: new Date().toISOString(),
        deadline: deadlineInput.value ? new Date(deadlineInput.value).toISOString() : null,
        notify: notifyCheckbox.checked === true
    }

    tasks.push(newTask)
    localStorage.setItem(currentuser, JSON.stringify(tasks))
    showmsg();
    // Reset deadline and notify
    deadlineInput.value = ''
    notifyCheckbox.checked = false
})

checkbtn.addEventListener('click', function () {
    cont.classList.add("hide1")
    showcont.classList.remove("hide2")
    showTask()
    updateStats()
    msg.classList.remove('show')
})

addshowbtn.addEventListener('click', function () {
    showcont.classList.add("hide2")
    cont.classList.remove('hide1')
    clearmsg.classList.remove('show')
})

clearAllbtn.addEventListener('click', function () {
    const tasks = JSON.parse(localStorage.getItem(currentuser))
    if (!tasks.length) {
        tasksmsg.textContent = "No tasks to clear"
        return
    }

    if (confirm("Are you sure you want to clear all tasks? This action cannot be undone.")) {
        localStorage.setItem(currentuser, JSON.stringify([]))
        showTask()
        updateStats()
        tasksmsg.textContent = ''
        clearmsg.textContent = "All tasks have been cleared successfully"
        clearmsg.classList.add('show')
    }
})

// Add filter functionality
filterSelect.addEventListener('change', function () {
    showTask()
})

// Add logout functionality
logoutBtn.addEventListener('click', function () {
    if (confirm("Are you sure you want to logout?")) {
        logout()
    }
})

// Add Enter key support
input.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        addbtn.click()
    }
})

inputname.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        loginbtn.click()
    }
})

function showmsg() {
    msg.textContent = 'Task added successfully!'
    msg.classList.add('show')
    input.value = ''

    // Hide message after 3 seconds
    setTimeout(() => {
        msg.classList.remove('show')
    }, 3000)
}

function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div')
    notification.className = `notification ${type}`
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        ${message}
    `

    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-weight: 500;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `

    document.body.appendChild(notification)

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)'
    }, 100)

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)'
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification)
            }
        }, 300)
    }, 3000)
}

function showTask() {
    const tasks = JSON.parse(localStorage.getItem(currentuser))
    taskcont.innerHTML = ''

    if (!tasks.length) {
        tasksmsg.innerHTML = `
            <i class="fas fa-clipboard-list" style="font-size: 3rem; color: #cbd5e1; margin-bottom: 1rem;"></i><br>
            No tasks yet. Add your first task to get started!
        `
        return
    }

    // Filter tasks based on selected filter
    const filter = filterSelect.value
    let filteredTasks = tasks

    switch (filter) {
        case 'pending':
            filteredTasks = tasks.filter(task => !task.completed)
            break
        case 'completed':
            filteredTasks = tasks.filter(task => task.completed)
            break
        case 'high':
        case 'medium':
        case 'low':
            filteredTasks = tasks.filter(task => task.priority === filter)
            break
        default:
            filteredTasks = tasks
    }

    if (filteredTasks.length === 0) {
        tasksmsg.innerHTML = `
            <i class="fas fa-filter" style="font-size: 3rem; color: #cbd5e1; margin-bottom: 1rem;"></i><br>
            No tasks match the current filter.
        `
        return
    }

    tasksmsg.textContent = ""

    // Sort by priority (high > medium > low) and then by completion status
    filteredTasks.sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 }
        if (a.completed !== b.completed) {
            return a.completed - b.completed // Pending tasks first
        }
        return priorityOrder[b.priority] - priorityOrder[a.priority]
    })

    filteredTasks.forEach((task, index) => {
        const div = document.createElement('div')
        div.classList.add('task', `priority-${task.priority}`)
        if (task.completed) {
            div.classList.add('completed')
        }

        // Determine deadline display and overdue state
        let deadlineHtml = ''
        let isOverdue = false
        if (task.deadline) {
            const dl = new Date(task.deadline)
            const now = new Date()
            isOverdue = !task.completed && dl < now
            deadlineHtml = `<div class="task-deadline ${isOverdue ? 'overdue' : ''}">Due: ${dl.toLocaleString()}</div>`
        }

        div.innerHTML = `
            <div class="task-header">
                <div class="task-priority ${task.priority}">${task.priority} Priority</div>
                <div class="task-status">
                    <div class="task-checkbox ${task.completed ? 'checked' : ''}" onclick="toggleTaskById(${task.id})">
                        ${task.completed ? '<i class="fas fa-check"></i>' : ''}
                    </div>
                </div>
            </div>
            <div class="task-content">${task.text}${deadlineHtml}</div>
            <div class="task-actions">
                <button onclick="toggleTaskById(${task.id})" class="complete-btn" title="${task.completed ? 'Mark as pending' : 'Mark as complete'}">
                    <i class="fas ${task.completed ? 'fa-undo' : 'fa-check'}"></i>
                </button>
                <button onclick="deleteTaskById(${task.id})" title="Delete task">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        taskcont.appendChild(div)
    });
}

// Request browser notification permission and schedule periodic checks
function ensureNotificationPermission() {
    if (!('Notification' in window)) return
    if (Notification.permission === 'default') {
        Notification.requestPermission()
    }
}

// Check due tasks every 30 seconds and notify if needed
setInterval(() => {
    if (!currentuser) return
    const tasks = JSON.parse(localStorage.getItem(currentuser)) || []
    const now = new Date()
    tasks.forEach(task => {
        if (task.deadline && task.notify && !task.completed && !task._notified) {
            const dl = new Date(task.deadline)
            // If deadline passed (or within the last 5 seconds), notify
            if (dl <= now) {
                // in-app notification
                showNotification(`Task due: ${task.text}`, 'error')
                // browser notification if allowed
                if (window.Notification && Notification.permission === 'granted') {
                    try {
                        new Notification('Task due', { body: task.text })
                    } catch (e) {
                        // ignore
                    }
                }
                // mark as notified so we don't repeat
                task._notified = true
            }
        }
    })
    localStorage.setItem(currentuser, JSON.stringify(tasks))
    // update UI to reflect overdue state
    if (showcont && !showcont.classList.contains('hide2')) {
        showTask()
        updateStats()
    }
}, 30000)

// Ensure permission when the app gains focus or after login
window.addEventListener('focus', ensureNotificationPermission)

// Call ensureNotificationPermission at script load
ensureNotificationPermission()

function updateStats() {
    const tasks = JSON.parse(localStorage.getItem(currentuser))
    const total = tasks.length
    const completed = tasks.filter(task => task.completed).length
    const pending = total - completed
    const progressPercentage = total > 0 ? Math.round((completed / total) * 100) : 0

    totalTasksEl.textContent = total
    completedTasksEl.textContent = completed
    pendingTasksEl.textContent = pending
    progressFill.style.width = `${progressPercentage}%`
    progressText.textContent = `${progressPercentage}% Complete`
}

function toggleTask(index) {
    const tasks = JSON.parse(localStorage.getItem(currentuser))
    tasks[index].completed = !tasks[index].completed
    localStorage.setItem(currentuser, JSON.stringify(tasks))
    showTask()
    updateStats()

    const status = tasks[index].completed ? 'completed' : 'pending'
    showNotification(`Task marked as ${status}`, "success")
}

function toggleTaskById(taskId) {
    const tasks = JSON.parse(localStorage.getItem(currentuser))
    const taskIndex = tasks.findIndex(t => t.id === taskId)

    if (taskIndex !== -1) {
        tasks[taskIndex].completed = !tasks[taskIndex].completed
        localStorage.setItem(currentuser, JSON.stringify(tasks))
        showTask()
        updateStats()

        const status = tasks[taskIndex].completed ? 'completed' : 'pending'
        showNotification(`Task marked as ${status}`, "success")
    }
}

function deleteTaskById(taskId) {
    if (confirm("Are you sure you want to delete this task?")) {
        const tasks = JSON.parse(localStorage.getItem(currentuser))
        const taskIndex = tasks.findIndex(t => t.id === taskId)

        if (taskIndex !== -1) {
            tasks.splice(taskIndex, 1)
            localStorage.setItem(currentuser, JSON.stringify(tasks))
            showTask()
            updateStats()
            showNotification("Task deleted successfully", "success")
        }
    }
}

function deleteTask(index) {
    if (confirm("Are you sure you want to delete this task?")) {
        const tasks = JSON.parse(localStorage.getItem(currentuser));
        tasks.splice(index, 1)
        localStorage.setItem(currentuser, JSON.stringify(tasks))
        showTask()
        updateStats()
        showNotification("Task deleted successfully", "success")
    }
}

// Migration function to convert old string tasks to new object format
function migrateTasks() {
    const tasks = JSON.parse(localStorage.getItem(currentuser))
    if (tasks.length > 0 && typeof tasks[0] === 'string') {
        const migratedTasks = tasks.map((task, index) => ({
            id: Date.now() + index,
            text: task,
            priority: 'medium',
            completed: false,
            createdAt: new Date().toISOString()
        }))
        localStorage.setItem(currentuser, JSON.stringify(migratedTasks))
        showNotification("Tasks migrated to new format!", "success")
    }
}

// Logout function
function logout() {
    // Clear current user
    currentuser = ""

    // Hide user display and dashboard
    userDisplay.classList.add('hidden')
    cont.classList.add('hide1')
    showcont.classList.add('hide2')

    // Show login container
    loginContainer.classList.remove('hide3')

    // Clear input fields
    inputname.value = ''
    input.value = ''

    // Clear any messages
    msg.classList.remove('show')
    clearmsg.classList.remove('show')

    // Reset filter
    filterSelect.value = 'all'

    // Show logout notification
    showNotification("You have been logged out successfully", "success")
}
