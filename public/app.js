const API_URL = 'http://localhost:3000/tasks';

// DOM Elements
const taskInput = document.getElementById('task-input');
const todoList = document.getElementById('todo-list');

/* ========================
   CRUD FUNCTIONS
======================== */

// 1. CREATE - Add new task
async function addTask() {
  const text = taskInput.value.trim();
  if (!text) return;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({ text })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    taskInput.value = '';
    await fetchTasks(); // Refresh the list
  } catch (error) {
    console.error('Add Task Error:', error);
    alert('Failed to add task. See console for details.');
  }
}

// 2. READ - Fetch and display tasks
async function fetchTasks() {
  try {
    const response = await fetch(API_URL);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const tasks = await response.json();
    renderTasks(tasks);
  } catch (error) {
    console.error('Fetch Tasks Error:', error);
    alert('Failed to load tasks. See console for details.');
  }
}

// 3. UPDATE - Toggle task completion
async function toggleTaskCompletion(taskId, isCompleted) {
  try {
    const response = await fetch(`${API_URL}/${taskId}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({ 
        completed: isCompleted 
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    await fetchTasks(); // Refresh the list
  } catch (error) {
    console.error('Toggle Task Error:', error);
    alert('Failed to update task. See console for details.');
  }
}

// 4. DELETE - Remove task
async function deleteTask(taskId) {
  try {
    const response = await fetch(`${API_URL}/${taskId}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    await fetchTasks(); // Refresh the list
  } catch (error) {
    console.error('Delete Task Error:', error);
    alert('Failed to delete task. See console for details.');
  }
}

/* ========================
   UI RENDERING
======================== */
function renderTasks(tasks) {
  todoList.innerHTML = ''; // Clear current list

  tasks.forEach(task => {
    const taskItem = document.createElement('li');
    taskItem.className = 'task-item';
    
    // Task text with completion toggle
    const taskText = document.createElement('span');
    taskText.textContent = task.text;
    taskText.className = task.completed ? 'completed' : '';
    taskText.onclick = () => toggleTaskCompletion(task._id, !task.completed);
    
    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.className = 'delete-btn';
    deleteBtn.onclick = (e) => {
      e.stopPropagation(); // Prevent triggering the task completion toggle
      deleteTask(task._id);
    };
    
    taskItem.appendChild(taskText);
    taskItem.appendChild(deleteBtn);
    todoList.appendChild(taskItem);
  });
}

/* ========================
   INITIALIZATION
======================== */
document.addEventListener('DOMContentLoaded', () => {
  // Load tasks when page loads
  fetchTasks();
  
  // Add event listener for Enter key
  taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      addTask();
    }
  });
});