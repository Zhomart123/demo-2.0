const apiUrl = 'https://jsonplaceholder.typicode.com/todos';
let taskList = [];

function displayStatus(status) {
    const statusContainer = document.getElementById('status');
    statusContainer.textContent = `Status: ${status}`;
    if (status === 200) {
        statusContainer.style.color = 'green';
    }
    else if (status === 404 ) {
        statusContainer.style.color = 'hotpink';
    }
    else {
        statusContainer.style.color = 'green';
    }
}

async function fetchTasks() {
    try {
        const response = await fetch(apiUrl);
        displayStatus(response.status);
        if (!response.ok) throw new Error('could not find tasks');
        
        taskList = await response.json();
        displayTasks(taskList);
    } catch (error) {
        console.error('Error:', error);
        alert('Could not find tasks.');
    }
}

function displayTasks(tasks) {
    const taskContainer = document.getElementById('task-list');
    taskContainer.innerHTML = ''; 

    tasks.slice(0, 3).forEach(task => { 
        const taskDiv = document.createElement('div');
        taskDiv.classList.add('task');
        taskDiv.innerHTML = `
            <span>${task.title} ${task.completed ? "(Done)" : ""}</span>
            <div>
                <button onclick="markAsCompleted(${task.id})">Done</button>
                <button onclick="editTask(${task.id}, '${task.title}')">Edit</button>
                <button onclick="deleteTask(${task.id})">Delete</button>
            </div>
        `;
        taskContainer.appendChild(taskDiv);
    });
}

document.getElementById('task-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const taskInput = document.getElementById('task-input').value.trim();
    if (!taskInput) {
        alert('Task cannot be empty');
        return;
    }

    const newTask = {
        title: taskInput,
        userId: 1, 
        completed: false
    };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newTask),
        });
        displayStatus(response.status);
        if (!response.ok) throw new Error('could not add task');

        const createdTask = await response.json();
        taskList.unshift(createdTask); 
        displayTasks(taskList);

        alert('Task added successfully');
        document.getElementById('task-form').reset();
    } catch (error) {
        console.error('Error:', error);
    }
});

async function markAsCompleted(id) {
    const task = taskList.find(task => task.id === id);
    if (!task) {
        alert('Task not found');
        return;
    }

    const updatedTask = {
        ...task,
        completed: true
    };

    try {
        const response = await fetch(`${apiUrl}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedTask),
        });
        displayStatus(response.status);
        if (!response.ok) throw new Error('could not update task');

        taskList = taskList.map(task => task.id === id ? { ...task, completed: true } : task);
        displayTasks(taskList);

        alert('Task marked as completed');
    } catch (error) {
        console.error('Error:', error);
        displayStatus(404);
    }
}

async function editTask(id, currentTitle) {
    const newTitle = prompt('Edit task title:', currentTitle);
    if (newTitle === null || newTitle.trim() === '') return; 

    const updatedTask = {
        title: newTitle,
        userId: 1, 
        completed: false
    };

    try {
        const response = await fetch(`${apiUrl}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedTask),
        });
        displayStatus(response.status);
        if (!response.ok) throw new Error('could not update task');

        taskList = taskList.map(task => task.id === id ? { ...task, title: newTitle } : task);
        displayTasks(taskList);

        alert('Task updated successfully');
    } catch (error) {
        console.error('Error:', error);
        displayStatus(404);
    }
}

async function deleteTask(id) {
    try {
        const response = await fetch(`${apiUrl}/${id}`, {
            method: 'DELETE',
        });
        displayStatus(response.status);
        if (!response.ok) throw new Error('could not delete task');

        taskList = taskList.filter(task => task.id !== id);
        displayTasks(taskList);

        alert('Task deleted successfully');
    } catch (error) {
        console.error('Error:', error);
        displayStatus(404);
    }
}

fetchTasks();
