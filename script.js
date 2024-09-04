document.addEventListener("DOMContentLoaded", () => {

  const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks = storedTasks;
  currentFilter = 'all';
  updateTasksList();
  updateStats();
});

let tasks = [];
let currentFilter = 'all';

const saveTasks = () => {
  localStorage.setItem('tasks', JSON.stringify(tasks));
};

const addTask = () => {
  const taskInput = document.getElementById('taskinput');
  const text = taskInput.value.trim();

  if (text) {
    tasks.push({ text: text, completed: false });
    taskInput.value = "";
    updateTasksList();
    updateStats();
    saveTasks();
  }
};

const toggleTaskComplete = (index) => {
  tasks[index].completed = !tasks[index].completed;
  updateTasksList();
  updateStats();
  saveTasks();

  const allTasksCompleted = tasks.length > 0 && tasks.every(task => task.completed);

  // Confetti blast on task completion
  if (allTasksCompleted) {
    blastConfetti();
  }
};

const deleteTask = (index) => {
  tasks.splice(index, 1);
  updateTasksList();
  updateStats();
  saveTasks();
};

const deleteAllTasks = () => {
  tasks = [];
  updateTasksList();
  updateStats();
  saveTasks();
};

const editTask = (index) => {
  const taskInput = document.getElementById('taskinput');
  taskInput.value = tasks[index].text;

  tasks.splice(index, 1);
  updateTasksList();
  updateStats();
  saveTasks();
};

const filterTasks = (filter) => {
  currentFilter = filter;
  updateTasksList();
};

const updateTasksList = () => {
  const taskList = document.getElementById('task-list');
  taskList.innerHTML = '';

  const filteredTasks = tasks.filter(task => {
    if (currentFilter === 'completed') return task.completed;
    if (currentFilter === 'pending') return !task.completed;
    return true;
  });

  filteredTasks.forEach((task, index) => {
    const li = document.createElement('li');
    if (task.completed) li.classList.add('checked');

    li.innerHTML = `
      <div class="checkbox" onclick="toggleTaskComplete(${index})"></div>
      <div class="task-content">${task.text}</div>
      <div class="icons">
        <img src="assets/images/edit-icon.png" alt="Edit" onclick="editTask(${index})" />
        <img src="assets/images/garbage-bin.png" alt="Delete" onclick="deleteTask(${index})" />
      </div>
    `;

    taskList.appendChild(li);
  });
};

const updateStats = () => {
  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;

  const numbersDiv = document.getElementById('numbers');
  const progressBar = document.getElementById('progress');

  numbersDiv.textContent = `${completedTasks} / ${totalTasks}`;

  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  progressBar.style.width = `${progressPercentage}%`;
};

document.getElementById('task-form').addEventListener('submit', (event) => {
  event.preventDefault();
  addTask();
});

document.querySelectorAll('.filter').forEach(filterElement => {
  filterElement.addEventListener('click', () => {
    filterTasks(filterElement.getAttribute('data-filter'));

    document.querySelectorAll('.filter').forEach(el => el.classList.remove('active'));
    filterElement.classList.add('active');
  });
});

document.getElementById('delete-all').addEventListener('click', deleteAllTasks);

const blastConfetti = () => {
  const count = 200;
  const defaults = { origin: { y: 0.7 } };

  function fire(particleRatio, opts) {
    confetti(
      Object.assign({}, defaults, opts, {
        particleCount: Math.floor(count * particleRatio),
      })
    );
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
  });

  fire(0.2, {
    spread: 60,
  });

  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });
};
