const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

window.onload = () => {
    tasks.forEach(task => createTaskElement(task.text, task.done));
};

addBtn.addEventListener("click", () => {
    const text = taskInput.value.trim();
    if (!text) return;

    const task = { text, done: false };
    tasks.push(task);
    saveTasks();

    createTaskElement(text, false);
    taskInput.value = "";
});

function createTaskElement(text, done) {
    const li = document.createElement("li");

    const span = document.createElement("span");
    span.textContent = text;

    if (done) li.classList.add("done");

    const doneBtn = document.createElement("button");
    doneBtn.textContent = "Kész";
    doneBtn.style.color = "green";

    const delBtn = document.createElement("button");
    delBtn.textContent = "Törlés";
    delBtn.style.color = "red";
    



    doneBtn.onclick = () => {
        li.classList.toggle("done");
        updateTask(text, li.classList.contains("done"));
    };

    delBtn.onclick = () => {
        li.remove();
        deleteTask(text);
    };

    li.appendChild(span);
    li.appendChild(doneBtn);
    li.appendChild(delBtn);
    taskList.appendChild(li);
}





function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}


function updateTask(text, done) {
    tasks = tasks.map(t => t.text === text ? { ...t, done } : t);
    saveTasks();
}




function deleteTask(text) {
    tasks = tasks.filter(t => t.text !== text);
    saveTasks();
}




let seconds = 0;
let interval = null;

const timeDisplay = document.getElementById("time");
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const resetBtn = document.getElementById("resetBtn");

startBtn.onclick = () => {
    if (interval) return;
    interval = setInterval(() => {
        seconds++;
        updateDisplay();
    }, 1000);
};

stopBtn.onclick = () => {
    clearInterval(interval);
    interval = null;
};

resetBtn.onclick = () => {
    clearInterval(interval);
    interval = null;
    seconds = 0;
    updateDisplay();
};

function updateDisplay() {
    let h = String(Math.floor(seconds / 3600)).padStart(2, "0");
    let m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    let s = String(seconds % 60).padStart(2, "0");

    timeDisplay.textContent = `${h}:${m}:${s}`;
}

////////////////////////

// / / AI része / / / //

////////////////////////

// --- Animáció, amikor egy feladat megjelenik vagy eltűnik ---
function animateTaskAdd(li) {
    li.classList.add('task-in');
    setTimeout(() => li.classList.remove('task-in'), 600);
}
function animateTaskRemove(li, cb) {
    li.classList.add('task-out');
    setTimeout(() => { cb(); }, 500);
}

// --- Feladatok számláló ---
function updateCounter() {
    const count = document.querySelectorAll('#taskList li').length;
    let counter = document.getElementById('taskCounter');
    if (!counter) {
        counter = document.createElement('div');
        counter.id = 'taskCounter';
        counter.style.margin = '18px 0 0 0';
        counter.style.textAlign = 'center';
        counter.style.color = '#00fff6';
        counter.style.fontWeight = 'bold';
        document.querySelector('.container').insertBefore(counter, document.querySelector('h2'));
    }
    counter.textContent = count === 0 ? 'Nincs hátralévő feladat!' : `${count} feladat van hátra`;
}

// --- Sötét/világos mód kapcsoló ---
function setupThemeToggle() {
    let btn = document.getElementById('themeToggle');
    if (!btn) {
        btn = document.createElement('button');
        btn.id = 'themeToggle';
        btn.textContent = '☀️';
        
        }
        if (btn.textContent === '☀️') {
            onclick = () => {
                document.body.classList.toggle('light-mode');
                btn.textContent = '🌙';
            
            };
            document.body.appendChild(btn);
        } else {
            onclick = () => {                document.body.classList.toggle('light-mode');
                btn.textContent = document.body.classList.contains('light-mode') ? '☀️' : '🌙';
            }
        }

        btn.style.position = 'absolute';
        btn.style.top = '18px';
        btn.style.right = '24px';
        btn.style.zIndex = 10;
        btn.style.background = 'linear-gradient(90deg, #232526 60%, #3a7bd5 100%)';
        btn.style.color = '#fff';
        btn.style.border = 'none';
        btn.style.borderRadius = '12px';
        btn.style.padding = '8px 18px';
        btn.style.fontSize = '1.1rem';
        btn.style.cursor = 'pointer';
        btn.style.boxShadow = '0 2px 8px #00d2ff44';
        document.body.appendChild(btn);
    }
    btn.onclick = () => {
        document.body.classList.toggle('light-mode');
    };


// --- Drag & drop sorrendezés ---
function setupDragDrop() {
    let dragged;
    const list = document.getElementById('taskList');
    list.addEventListener('dragstart', function(e) {
        dragged = e.target;
        e.target.style.opacity = 0.5;
    });
    list.addEventListener('dragend', function(e) {
        e.target.style.opacity = '';
    });
    list.addEventListener('dragover', function(e) {
        e.preventDefault();
        const after = getDragAfterElement(list, e.clientY);
        if (after == null) {
            list.appendChild(dragged);
        } else {
            list.insertBefore(dragged, after);
        }
    });
}
function getDragAfterElement(list, y) {
    const draggables = [...list.querySelectorAll('li:not(.dragging)')];
    return draggables.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: -Infinity }).element;
}

// --- Teendőlista logika ---
document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('taskInput');
    const addBtn = document.getElementById('addBtn');
    const list = document.getElementById('taskList');
    setupThemeToggle();
    setupDragDrop();
    updateCounter();

    addBtn.onclick = () => {
        if (!input.value.trim()) return;
        const li = document.createElement('li');
        li.textContent = input.value;
        li.setAttribute('draggable', 'true');
        li.onclick = () => {
            li.classList.toggle('done');
        };
        // Animáció hozzáadáskor
        animateTaskAdd(li);
        list.appendChild(li);
        input.value = '';
        updateCounter();
    };

    list.addEventListener('click', function(e) {
        if (e.target.tagName === 'LI') {
            e.target.classList.toggle('done');
        }
    });

    list.addEventListener('dblclick', function(e) {
        if (e.target.tagName === 'LI') {
            animateTaskRemove(e.target, () => {
                e.target.remove();
                updateCounter();
            });
        }
    });
});
// ...existing code...