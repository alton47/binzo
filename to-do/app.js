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

// ── Modal ─────────────────────────────────────────────────────
function openModal(taskId) {
  const task = (window._tasks || []).find(t => t.id === taskId);
  if (!task) return;
  document.getElementById('modal-title').textContent = task.text;
  document.getElementById('modal-body').textContent =
    'Priority: ' + task.priority.toUpperCase() +
    ' | Due: ' + (task.dueDate || 'Not set') +
    ' | Status: ' + (task.done ? 'Done' : 'Active') +
    ' | Created: ' + new Date(task.createdAt).toLocaleString();
  document.getElementById('modal').classList.remove('hidden');
}
document.getElementById('modal-close')?.addEventListener('click', () => {
  document.getElementById('modal').classList.add('hidden');
});
document.getElementById('modal')?.addEventListener('click', function(e) {
  if (e.target === this) this.classList.add('hidden');
});

// ── Due Dates ─────────────────────────────────────────────────
function isOverdue(d) { return d && new Date(d) < new Date(new Date().toISOString().split('T')[0]); }
function isDueToday(d) { return d && d === new Date().toISOString().split('T')[0]; }
function dueDateLabel(d) {
  if (!d) return '';
  if (isOverdue(d)) return '<span class="due-label overdue">⚠️ Overdue: ' + d + '</span>';
  if (isDueToday(d)) return '<span class="due-label today">📅 Today</span>';
  return '<span class="due-label">📅 ' + d + '</span>';
}

// ── Export JSON ───────────────────────────────────────────────
document.getElementById('export-btn')?.addEventListener('click', function() {
  const blob = new Blob([JSON.stringify(window._tasks || [], null, 2)], {type:'application/json'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'taskflow-' + new Date().toISOString().split('T')[0] + '.json';
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(a.href);
});

// ── Keyboard Shortcuts ────────────────────────────────────────
document.addEventListener('keydown', function(e) {
  if (e.key === 'Enter' && document.activeElement?.id === 'task-input')
    document.getElementById('add-btn')?.click();
  if (e.key === 'Escape')
    document.getElementById('modal')?.classList.add('hidden');
  if (e.ctrlKey && e.key === 'd') { e.preventDefault(); document.getElementById('theme-toggle')?.click(); }
  if (e.ctrlKey && e.key === 'e') { e.preventDefault(); document.getElementById('export-btn')?.click(); }
});
const _hint = document.createElement('div');
_hint.className = 'shortcut-hint';
_hint.innerHTML = '⌨️ Enter=add | Esc=close | Ctrl+D=dark | Ctrl+E=export';
document.body.appendChild(_hint);

// ── Clear Done ────────────────────────────────────────────────
document.getElementById('clear-done')?.addEventListener('click', function() {
  const before = (window._tasks || []).length;
  window._tasks = (window._tasks || []).filter(t => !t.done);
  saveTasks(); renderTasks();
  showToast('Cleared ' + (before - window._tasks.length) + ' completed tasks');
});

// ── Toast ─────────────────────────────────────────────────────
function showToast(msg, duration) {
  duration = duration || 2500;
  const old = document.querySelector('.toast');
  if (old) old.remove();
  const t = document.createElement('div');
  t.className = 'toast'; t.textContent = msg;
  document.body.appendChild(t);
  requestAnimationFrame(() => t.classList.add('toast-visible'));
  setTimeout(() => { t.classList.remove('toast-visible'); setTimeout(() => t.remove(), 300); }, duration);
}

// ── Empty State ───────────────────────────────────────────────
function renderEmptyState(container, filtered) {
  if (filtered.length > 0) return;
  const div = document.createElement('div');
  div.className = 'empty-state';
  div.innerHTML = (window._tasks||[]).length === 0
    ? '<span>🎉</span><p>No tasks yet! Add one above.</p>'
    : '<span>🔍</span><p>No tasks match your filters.</p>';
  container.appendChild(div);
}

// ── Inline Edit ───────────────────────────────────────────────
function makeEditable(taskId, spanEl) {
  const task = (window._tasks||[]).find(t => t.id === taskId);
  if (!task) return;
  const input = document.createElement('input');
  input.type = 'text'; input.value = task.text; input.className = 'inline-edit';
  spanEl.replaceWith(input); input.focus(); input.select();
  function save() {
    const v = input.value.trim();
    if (v && v !== task.text) { task.text = v; saveTasks(); }
    renderTasks();
  }
  input.addEventListener('blur', save);
  input.addEventListener('keydown', e => { if(e.key==='Enter'){e.preventDefault();save();} if(e.key==='Escape') renderTasks(); });
}

// ── Confetti ──────────────────────────────────────────────────
function launchConfetti() {
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth; canvas.height = window.innerHeight;
  const pieces = Array.from({length:120}, () => ({
    x: Math.random()*canvas.width, y: Math.random()*-canvas.height,
    r: Math.random()*7+3, d: Math.random()*3+1,
    color: 'hsl('+Math.floor(Math.random()*360)+',80%,60%)',
    tilt: Math.random()*10-5
  }));
  let frame = 0;
  function draw() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    pieces.forEach(p => {
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,2*Math.PI);
      ctx.fillStyle = p.color; ctx.fill();
      p.y += p.d; p.x += Math.sin(frame*0.02+p.tilt)*1.5;
    });
    frame++;
    if (frame < 200) requestAnimationFrame(draw); else canvas.remove();
  }
  draw();
}
function checkAllDone() {
  const t = window._tasks||[];
  if (t.length > 0 && t.every(x => x.done)) { launchConfetti(); showToast('🎉 All tasks complete!'); }
}

// ── Counter ───────────────────────────────────────────────────
function updateCounter() {
  const tasks = window._tasks||[];
  const el = document.getElementById('task-count');
  if (el) el.textContent = tasks.length === 0 ? 'No tasks' : tasks.filter(t=>t.done).length+'/'+tasks.length+' done';
}

// ── Scroll to new task ────────────────────────────────────────
function scrollToLatest() {
  const list = document.getElementById('task-list');
  if (list && list.lastElementChild)
    list.lastElementChild.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ── Character counter ─────────────────────────────────────────
(function initCharCount() {
  const input = document.getElementById('task-input');
  if (!input) return;
  const counter = document.createElement('span');
  counter.className = 'char-count';
  counter.textContent = '0/100';
  input.parentNode.insertBefore(counter, input.nextSibling);
  input.addEventListener('input', () => {
    const len = input.value.length;
    counter.textContent = len + '/100';
    counter.style.color = len > 90 ? '#e74c3c' : '#aaa';
    if (len > 100) input.value = input.value.slice(0, 100);
  });
})();

// ── Sort tasks ────────────────────────────────────────────────
function sortTasks(tasks, method) {
  const copy = [...tasks];
  if (method === 'priority') {
    const w = { high:0, medium:1, low:2 };
    return copy.sort((a,b) => (w[a.priority]??3)-(w[b.priority]??3));
  }
  if (method === 'due') return copy.sort((a,b) => {
    if (!a.dueDate) return 1; if (!b.dueDate) return -1;
    return new Date(a.dueDate)-new Date(b.dueDate);
  });
  if (method === 'alpha') return copy.sort((a,b) => a.text.localeCompare(b.text));
  return copy;
}

// ── Sort dropdown ─────────────────────────────────────────────
(function initSortControl() {
  const controls = document.querySelector('.controls');
  if (!controls) return;
  const sel = document.createElement('select');
  sel.id = 'sort-select';
  sel.innerHTML = '<option value="default">Sort: Default</option>' +
    '<option value="priority">Sort: Priority</option>' +
    '<option value="due">Sort: Due Date</option>' +
    '<option value="alpha">Sort: A-Z</option>';
  controls.appendChild(sel);
  sel.addEventListener('change', renderTasks);
})();

// ── Bulk select ───────────────────────────────────────────────
let _selectedIds = new Set();
function toggleSelect(taskId) {
  _selectedIds.has(taskId) ? _selectedIds.delete(taskId) : _selectedIds.add(taskId);
  renderTasks(); updateBulkBar();
}
function updateBulkBar() {
  let bar = document.getElementById('bulk-bar');
  if (_selectedIds.size === 0) { if (bar) bar.remove(); return; }
  if (!bar) {
    bar = document.createElement('div');
    bar.id = 'bulk-bar'; bar.className = 'bulk-bar';
    document.querySelector('.app').appendChild(bar);
  }
  bar.innerHTML = _selectedIds.size + ' selected &nbsp;' +
    '<button onclick="bulkDelete()">Delete</button> ' +
    '<button onclick="bulkDone()">Mark Done</button> ' +
    '<button onclick="clearSelection()">Cancel</button>';
}
function bulkDelete() {
  window._tasks=(window._tasks||[]).filter(t=>!_selectedIds.has(t.id));
  clearSelection(); saveTasks(); renderTasks();
}
function bulkDone() {
  (window._tasks||[]).forEach(t=>{if(_selectedIds.has(t.id))t.done=true;});
  clearSelection(); saveTasks(); renderTasks();
}
function clearSelection() { _selectedIds.clear(); updateBulkBar(); renderTasks(); }
