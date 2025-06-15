// app.js file

const API_URL = 'http://localhost:3000/tasks';

async function fetchTasks() {
    try {
        const res = await fetch(API_URL);
        
        if (!res.ok) {
            throw new Error(`Failed to fetch tasks: ${res.status}`);
        }

        const tasks = await res.json();
        const list = document.getElementById('todo-list');
        list.innerHTML = '';  

        tasks.forEach(task => {
            const li = document.createElement('li');
            li.textContent = task.text;
            if (task.completed) li.classList.add('completed');

            const completeBtn = document.createElement('button');
            completeBtn.textContent = '✔️';
            completeBtn.onclick = async () => {
                try {
                    await fetch(`${API_URL}/${task._id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ completed: !task.completed })
                    });
                    fetchTasks(); 
                } catch (error) {
                    console.error('Error updating task:', error.message);
                }
            };

            
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = '❌';
            deleteBtn.onclick = async () => {
                try {
                    await fetch(`${API_URL}/${task._id}`, { method: 'DELETE' });
                    fetchTasks(); 
                } catch (error) {
                    console.error('Error deleting task:', error.message);
                }
            };

            li.appendChild(completeBtn);
            li.appendChild(deleteBtn);
            list.appendChild(li);
        });

    } catch (error) {
        console.error('Error fetching tasks:', error.message);
    }
}

async function addTask() {
    const input = document.getElementById('task-input');
    const text = input.value.trim();
    if (!text) return;  

    try {
        await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
        });
        input.value = '';  
        fetchTasks(); 
    } catch (error) {
        console.error('Error adding task:', error.message);
    }
}

fetchTasks(); 
