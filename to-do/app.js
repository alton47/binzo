let tasks = JSON.parse(localStorage.getItem("taskflow-tasks")) || [];
let dragSrcIndex = null;

// ── DOM refs ──────────────────────────────────────────────────
const taskInput = document.getElementById("task-input");
const dueDateInput = document.getElementById("due-date");
const prioritySelect = document.getElementById("priority-select");
const addBtn = document.getElementById("add-btn");
const taskList = document.getElementById("task-list");
const searchInput = document.getElementById("search-input");
const filterSelect = document.getElementById("filter-select");
const priorityFilter = document.getElementById("priority-filter");
const themeToggle = document.getElementById("theme-toggle");
const exportBtn = document.getElementById("export-btn");
const clearDoneBtn = document.getElementById("clear-done");
const taskCount = document.getElementById("task-count");
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modal-title");
const modalBody = document.getElementById("modal-body");
const modalClose = document.getElementById("modal-close");

// ── Theme ─────────────────────────────────────────────────────
const savedTheme = localStorage.getItem("taskflow-theme");
if (savedTheme === "dark") {
  document.body.classList.add("dark");
  themeToggle.textContent = "☀️ Light Mode";
}

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  themeToggle.textContent = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
  localStorage.setItem("taskflow-theme", isDark ? "dark" : "light");
});

// ── Add Task ──────────────────────────────────────────────────
addBtn.addEventListener("click", addTask);

function addTask() {
  const text = taskInput.value.trim();
  if (!text) return;

  const task = {
    id: Date.now(),
    text,
    done: false,
    priority: prioritySelect.value,
    dueDate: dueDateInput.value,
    createdAt: new Date().toISOString(),
  };

  tasks.push(task);
  saveTasks();
  renderTasks();

  taskInput.value = "";
  dueDateInput.value = "";
  prioritySelect.value = "low";
}

// ── Render ─────────────────────────────────────────────────────
function renderTasks() {
  const query = searchInput.value.toLowerCase();
  const filter = filterSelect.value;
  const priFilter = priorityFilter.value;

  let filtered = tasks.filter((t) => {
    const matchSearch = t.text.toLowerCase().includes(query);
    const matchFilter =
      filter === "all" || (filter === "done" ? t.done : !t.done);
    const matchPriority = priFilter === "all" || t.priority === priFilter;
    return matchSearch && matchFilter && matchPriority;
  });

  taskList.innerHTML = "";

  filtered.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = "task-item" + (task.done ? " done" : "");
    li.draggable = true;
    li.dataset.id = task.id;

    li.innerHTML = `
      <span class="priority-badge priority-${task.priority}">${task.priority}</span>
      <span class="task-text">${escapeHTML(task.text)}</span>
      ${task.dueDate ? `<span class="due-label">📅 ${task.dueDate}</span>` : ""}
      <div class="task-actions">
        <button class="btn-done" onclick="toggleDone(${task.id})">${task.done ? "Undo" : "Done"}</button>
        <button class="btn-detail" onclick="showModal(${task.id})">Detail</button>
        <button class="btn-delete" onclick="deleteTask(${task.id})">Delete</button>
      </div>
    `;

    // Drag events
    li.addEventListener("dragstart", () => {
      dragSrcIndex = tasks.findIndex((t) => t.id === task.id);
      li.classList.add("dragging");
    });
    li.addEventListener("dragend", () => li.classList.remove("dragging"));
    li.addEventListener("dragover", (e) => e.preventDefault());
    li.addEventListener("drop", () => {
      const destIndex = tasks.findIndex((t) => t.id === task.id);
      const [moved] = tasks.splice(dragSrcIndex, 1);
      tasks.splice(destIndex, 0, moved);
      saveTasks();
      renderTasks();
    });

    taskList.appendChild(li);
  });

  taskCount.textContent = `${tasks.length} task${tasks.length !== 1 ? "s" : ""}`;
}

// ── Actions ───────────────────────────────────────────────────
function toggleDone(id) {
  const t = tasks.find((t) => t.id === id);
  if (t) {
    t.done = !t.done;
    saveTasks();
    renderTasks();
  }
}

function deleteTask(id) {
  tasks = tasks.filter((t) => t.id !== id);
  saveTasks();
  renderTasks();
}

function showModal(id) {
  const t = tasks.find((t) => t.id === id);
  if (!t) return;
  modalTitle.textContent = t.text;
  modalBody.textContent = `Priority: ${t.priority} | Due: ${t.dueDate || "None"} | Status: ${t.done ? "Done" : "Active"} | Created: ${new Date(t.createdAt).toLocaleString()}`;
  modal.classList.remove("hidden");
}

modalClose.addEventListener("click", () => modal.classList.add("hidden"));
modal.addEventListener("click", (e) => {
  if (e.target === modal) modal.classList.add("hidden");
});

// ── Export ────────────────────────────────────────────────────
exportBtn.addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(tasks, null, 2)], {
    type: "application/json",
  });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "taskflow-export.json";
  a.click();
});

// ── Clear Done ────────────────────────────────────────────────
clearDoneBtn.addEventListener("click", () => {
  tasks = tasks.filter((t) => !t.done);
  saveTasks();
  renderTasks();
});

// ── Search & Filter ───────────────────────────────────────────
searchInput.addEventListener("input", renderTasks);
filterSelect.addEventListener("change", renderTasks);
priorityFilter.addEventListener("change", renderTasks);

// ── Keyboard Shortcuts ────────────────────────────────────────
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && document.activeElement === taskInput) addTask();
  if (e.key === "Escape") modal.classList.add("hidden");
  if (e.ctrlKey && e.key === "d") {
    document.body.classList.toggle("dark");
    renderTasks();
  }
});

// Hint
const hint = document.createElement("div");
hint.className = "shortcut-hint";
hint.textContent = "Enter = add · Esc = close · Ctrl+D = dark";
document.body.appendChild(hint);

// ── Storage ───────────────────────────────────────────────────
function saveTasks() {
  localStorage.setItem("taskflow-tasks", JSON.stringify(tasks));
}

function escapeHTML(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// ── Init ──────────────────────────────────────────────────────
renderTasks();

// ── Dark Mode ─────────────────────────────────────────────────
(function initTheme() {
  const saved = localStorage.getItem('taskflow-theme');
  if (saved === 'dark') {
    document.body.classList.add('dark');
    const btn = document.getElementById('theme-toggle');
    if (btn) btn.textContent = '☀️ Light Mode';
  }
})();
document.getElementById('theme-toggle')?.addEventListener('click', function() {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  this.textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
  localStorage.setItem('taskflow-theme', isDark ? 'dark' : 'light');
});

// ── Storage Helpers ───────────────────────────────────────────
function saveTasks() {
  try { localStorage.setItem('taskflow-tasks', JSON.stringify(window._tasks || [])); }
  catch(e) { console.warn('Storage save failed:', e); }
}
function loadTasks() {
  try { const raw = localStorage.getItem('taskflow-tasks'); return raw ? JSON.parse(raw) : []; }
  catch(e) { return []; }
}
window._tasks = loadTasks();

// ── Drag & Drop ───────────────────────────────────────────────
let _dragSrcId = null;
function attachDragEvents(li, taskId) {
  li.setAttribute('draggable', 'true');
  li.addEventListener('dragstart', function(e) {
    _dragSrcId = taskId;
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
  });
  li.addEventListener('dragend', function() { this.classList.remove('dragging'); });
  li.addEventListener('dragover', function(e) {
    e.preventDefault();
    document.querySelectorAll('.task-item').forEach(el => el.classList.remove('drag-over'));
    this.classList.add('drag-over');
  });
  li.addEventListener('drop', function(e) {
    e.preventDefault();
    if (_dragSrcId === taskId) return;
    const tasks = window._tasks;
    const fromIdx = tasks.findIndex(t => t.id === _dragSrcId);
    const toIdx   = tasks.findIndex(t => t.id === taskId);
    if (fromIdx < 0 || toIdx < 0) return;
    const [moved] = tasks.splice(fromIdx, 1);
    tasks.splice(toIdx, 0, moved);
    saveTasks();
    renderTasks();
  });
}

// ── Filter & Search ───────────────────────────────────────────
function getFilteredTasks() {
  const query    = (document.getElementById('search-input')?.value || '').toLowerCase();
  const status   = document.getElementById('filter-select')?.value || 'all';
  const priority = document.getElementById('priority-filter')?.value || 'all';
  return (window._tasks || []).filter(t => {
    const matchText     = t.text.toLowerCase().includes(query);
    const matchStatus   = status === 'all' || (status === 'done' ? t.done : !t.done);
    const matchPriority = priority === 'all' || t.priority === priority;
    return matchText && matchStatus && matchPriority;
  });
}
document.getElementById('search-input')?.addEventListener('input', renderTasks);
document.getElementById('filter-select')?.addEventListener('change', renderTasks);
document.getElementById('priority-filter')?.addEventListener('change', renderTasks);
