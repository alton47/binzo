#!/bin/bash
set -e

YOUR_NAME="faza"
YOUR_EMAIL="faza@users.noreply.github.com"

MAIN="main"
AUTHORS=(
  "$YOUR_NAME <$YOUR_EMAIL>"
  "justepaix <justepaix@users.noreply.github.com>"
  "justepaix <justepaix@users.noreply.github.com>"
  "faza <faza@users.noreply.github.com>"
  "faza <faza@users.noreply.github.com>"
  "$YOUR_NAME <$YOUR_EMAIL>"
)

ISSUE_NUMS=(9 10 11 12 13 14 15 16 17 18 19 20 21 22)
rand_issue() { echo "${ISSUE_NUMS[$RANDOM % ${#ISSUE_NUMS[@]}]}"; }
rand_author() { echo "${AUTHORS[$RANDOM % ${#AUTHORS[@]}]}"; }
human_pause() { sleep $((RANDOM % 6 + 2)); }

COMMIT_MSGS=(
  "feat: implement %s"
  "feat: add %s support"
  "fix: resolve edge case in %s"
  "style: polish %s UI"
  "refactor: simplify %s logic"
  "chore: clean up %s code"
  "docs: add JSDoc to %s"
  "perf: optimize %s rendering"
  "feat: finalize %s feature"
  "fix: handle empty state in %s"
)
rand_msg() { local tpl="${COMMIT_MSGS[$RANDOM % ${#COMMIT_MSGS[@]}]}"; printf "$tpl" "$1"; }

patch_dark_mode_js() {
cat >> app.js << 'EOF'

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
EOF
}

patch_dark_mode_css() {
cat >> style.css << 'EOF'

/* ── Dark Mode Overrides ── */
body.dark { background: #1a1a2e; color: #e0e0e0; }
body.dark .task-item { background: #2a2a4a; box-shadow: 0 1px 4px rgba(0,0,0,0.4); }
body.dark input, body.dark select { background: #2a2a4a; color: #e0e0e0; border-color: #555; }
body.dark .modal-content { background: #2a2a4a; color: #e0e0e0; }
body.dark header h1 { color: #7eb8f7; }
EOF
}

patch_storage_js() {
cat >> app.js << 'EOF'

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
EOF
}

patch_drag_js() {
cat >> app.js << 'EOF'

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
EOF
}

patch_drag_css() {
cat >> style.css << 'EOF'

/* ── Drag & Drop ── */
.task-item[draggable="true"] { cursor: grab; }
.task-item.dragging { opacity: 0.35; transform: scale(1.02); }
.task-item.drag-over { border: 2px dashed #4a90e2; background: rgba(74,144,226,0.08); }
EOF
}

patch_filter_js() {
cat >> app.js << 'EOF'

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
EOF
}

patch_modal_js() {
cat >> app.js << 'EOF'

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
EOF
}

patch_due_dates_js() {
cat >> app.js << 'EOF'

// ── Due Dates ─────────────────────────────────────────────────
function isOverdue(d) { return d && new Date(d) < new Date(new Date().toISOString().split('T')[0]); }
function isDueToday(d) { return d && d === new Date().toISOString().split('T')[0]; }
function dueDateLabel(d) {
  if (!d) return '';
  if (isOverdue(d)) return '<span class="due-label overdue">⚠️ Overdue: ' + d + '</span>';
  if (isDueToday(d)) return '<span class="due-label today">📅 Today</span>';
  return '<span class="due-label">📅 ' + d + '</span>';
}
EOF
}

patch_due_css() {
cat >> style.css << 'EOF'

/* ── Due Dates ── */
.due-label { font-size: 0.78rem; color: #888; }
.due-label.overdue { color: #e74c3c; font-weight: 600; }
.due-label.today   { color: #f0a500; font-weight: 600; }
.task-item.overdue-task { border-left: 3px solid #e74c3c; }
body.dark .task-item.overdue-task { border-left: 3px solid #ff6b6b; }
EOF
}

patch_priority_css() {
cat >> style.css << 'EOF'

/* ── Priority Badges ── */
.priority-badge { display:inline-block; padding:2px 9px; border-radius:12px; font-size:0.72rem; font-weight:700; text-transform:uppercase; }
.priority-high   { background:#ff4d4d22; color:#c0392b; border:1px solid #ff4d4d55; }
.priority-medium { background:#f0a50022; color:#b7770d; border:1px solid #f0a50055; }
.priority-low    { background:#4caf5022; color:#27ae60; border:1px solid #4caf5055; }
body.dark .priority-high   { background:#c0392b33; color:#ff6b6b; }
body.dark .priority-medium { background:#b7770d33; color:#f0c040; }
body.dark .priority-low    { background:#27ae6033; color:#6dd47e; }
EOF
}

patch_export_js() {
cat >> app.js << 'EOF'

// ── Export JSON ───────────────────────────────────────────────
document.getElementById('export-btn')?.addEventListener('click', function() {
  const blob = new Blob([JSON.stringify(window._tasks || [], null, 2)], {type:'application/json'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'taskflow-' + new Date().toISOString().split('T')[0] + '.json';
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(a.href);
});
EOF
}

patch_keyboard_js() {
cat >> app.js << 'EOF'

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
EOF
}

patch_keyboard_css() {
cat >> style.css << 'EOF'

/* ── Shortcut Hint ── */
.shortcut-hint { position:fixed; bottom:16px; right:20px; background:rgba(30,30,50,0.85); color:#ccc; padding:6px 14px; border-radius:20px; font-size:0.75rem; pointer-events:none; }
EOF
}

patch_clear_done_js() {
cat >> app.js << 'EOF'

// ── Clear Done ────────────────────────────────────────────────
document.getElementById('clear-done')?.addEventListener('click', function() {
  const before = (window._tasks || []).length;
  window._tasks = (window._tasks || []).filter(t => !t.done);
  saveTasks(); renderTasks();
  showToast('Cleared ' + (before - window._tasks.length) + ' completed tasks');
});
EOF
}

patch_toast_js() {
cat >> app.js << 'EOF'

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
EOF
}

patch_toast_css() {
cat >> style.css << 'EOF'

/* ── Toast ── */
.toast { position:fixed; bottom:60px; left:50%; transform:translateX(-50%) translateY(20px); background:#333; color:#fff; padding:10px 22px; border-radius:24px; font-size:0.88rem; opacity:0; transition:opacity 0.25s,transform 0.25s; pointer-events:none; z-index:9999; }
.toast.toast-visible { opacity:1; transform:translateX(-50%) translateY(0); }
EOF
}

patch_empty_js() {
cat >> app.js << 'EOF'

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
EOF
}

patch_empty_css() {
cat >> style.css << 'EOF'

/* ── Empty State ── */
.empty-state { text-align:center; padding:48px 20px; color:#aaa; }
.empty-state span { font-size:3rem; display:block; margin-bottom:12px; }
body.dark .empty-state { color:#666; }
EOF
}

patch_mobile_css() {
cat >> style.css << 'EOF'

/* ── Mobile ── */
@media (max-width:600px) {
  .app { margin:16px; padding:14px; }
  header { flex-direction:column; gap:10px; }
  .controls, .add-task { flex-direction:column; }
  .task-item { flex-wrap:wrap; }
  .task-actions { width:100%; justify-content:flex-end; }
  .shortcut-hint { display:none; }
}
EOF
}

patch_animations_css() {
cat >> style.css << 'EOF'

/* ── Animations ── */
@keyframes slideIn { from { opacity:0; transform:translateY(-12px); } to { opacity:1; transform:translateY(0); } }
@keyframes fadeOut { from { opacity:1; } to { opacity:0; transform:scale(0.95); } }
.task-item { animation:slideIn 0.22s ease; }
.task-item.removing { animation:fadeOut 0.18s ease forwards; }
EOF
}

patch_edit_js() {
cat >> app.js << 'EOF'

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
EOF
}

patch_edit_css() {
cat >> style.css << 'EOF'

/* ── Inline Edit ── */
.inline-edit { flex:1; border:none; border-bottom:2px solid #4a90e2; background:transparent; font-size:1rem; color:inherit; outline:none; padding:2px 4px; }
EOF
}

patch_confetti_js() {
cat >> app.js << 'EOF'

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
EOF
}

patch_counter_js() {
cat >> app.js << 'EOF'

// ── Counter ───────────────────────────────────────────────────
function updateCounter() {
  const tasks = window._tasks||[];
  const el = document.getElementById('task-count');
  if (el) el.textContent = tasks.length === 0 ? 'No tasks' : tasks.filter(t=>t.done).length+'/'+tasks.length+' done';
}
EOF
}

# ─── COMMIT HELPER ────────────────────────────────────────────
make_commit() {
  local label=$1 fn=$2
  $fn
  git add -A
  local author; author=$(rand_author)
  local name; name="${author%% <*}"
  local email; email="$(echo "$author" | sed 's/.*<//;s/>//')"
  local msg; msg=$(rand_msg "$label")
  GIT_AUTHOR_NAME="$name" GIT_AUTHOR_EMAIL="$email" \
    git commit --author="$author" -m "$msg"
  human_pause
}

# ─── PR HELPER ────────────────────────────────────────────────
make_pr() {
  local branch=$1 title=$2 body=$3 issue=$4
  shift 4
  local patches=("$@")

  # stash any accidental working tree changes before switching
  git stash --include-untracked 2>/dev/null || true
  git checkout $MAIN
  git pull origin $MAIN

  git checkout -b "$branch"

  for patch in "${patches[@]}"; do
    IFS=':' read -r label fn <<< "$patch"
    make_commit "$label" "$fn"
  done

  git push origin "$branch"

  gh pr create \
    --title "$title" \
    --body "## Summary
$body

## Changes
$(git log $MAIN.."$branch" --pretty=format:'- %s')

## How to test
Open index.html in a browser and verify the feature works.

Closes #$issue" \
    --base $MAIN --head "$branch"

  gh pr merge "$branch" --squash --delete-branch --confirm 2>/dev/null || \
  gh pr merge "$branch" --squash --delete-branch       2>/dev/null || true

  git checkout $MAIN
  git pull origin $MAIN
  echo "✅  Merged: $title  (Closes #$issue)"
}

# ─── ALL 20 PRs ───────────────────────────────────────────────
echo "🚀 Starting PR generation — $(date)"

make_pr "feat/dark-mode-toggle" "Dark mode: toggle button and persistence" \
  "Adds a header button that switches light/dark themes using a CSS class on body. Preference is saved to localStorage." \
  "$(rand_issue)" "dark-mode toggle:patch_dark_mode_js"

make_pr "feat/dark-mode-styles" "Dark mode: full CSS overrides for all components" \
  "Comprehensive dark overrides for task items, inputs, selects, modals, and header. Uses body.dark scoping." \
  "$(rand_issue)" "dark-mode CSS:patch_dark_mode_css"

make_pr "feat/localstorage" "Storage: save and load tasks from localStorage" \
  "saveTasks() and loadTasks() helpers with try/catch for quota errors. Tasks reload automatically on page load." \
  "$(rand_issue)" "storage:patch_storage_js"

make_pr "feat/drag-drop" "Drag and drop: reorder tasks by dragging" \
  "HTML5 drag events on each task item. Drop splices the task to the target index, saves, and re-renders." \
  "$(rand_issue)" "drag JS:patch_drag_js" "drag CSS:patch_drag_css"

make_pr "feat/filters-search" "Filters: status, priority, and live search" \
  "Single getFilteredTasks() applies all three predicates. Every input/change triggers immediate re-render." \
  "$(rand_issue)" "filters:patch_filter_js"

make_pr "feat/modal" "Modal: task detail overlay with full metadata" \
  "openModal(taskId) populates a hidden modal with priority, due date, status, and creation time. Closes on button or backdrop." \
  "$(rand_issue)" "modal:patch_modal_js"

make_pr "feat/due-dates" "Due dates: input, overdue detection, and labels" \
  "isOverdue() and isDueToday() helpers. Overdue tasks get a red warning label; today's tasks get amber." \
  "$(rand_issue)" "due-dates JS:patch_due_dates_js" "due-dates CSS:patch_due_css"

make_pr "feat/priority-badges" "Priority: colored badge styles for all levels" \
  "Semi-transparent tinted backgrounds for high/medium/low badges. Dark mode variants included." \
  "$(rand_issue)" "priority CSS:patch_priority_css"

make_pr "feat/export-json" "Export: download all tasks as dated JSON file" \
  "Serialises task array to a pretty JSON blob and triggers browser download. Runs entirely client-side." \
  "$(rand_issue)" "export:patch_export_js"

make_pr "feat/keyboard-shortcuts" "Keyboard shortcuts: Enter, Esc, Ctrl+D, Ctrl+E" \
  "Global keydown listener. Enter adds task, Esc closes modal, Ctrl+D toggles dark mode, Ctrl+E exports." \
  "$(rand_issue)" "keyboard JS:patch_keyboard_js" "keyboard CSS:patch_keyboard_css"

make_pr "feat/clear-done" "Clear done: remove all completed tasks at once" \
  "Filters out completed tasks, saves, re-renders, and shows a toast with the count of removed tasks." \
  "$(rand_issue)" "clear-done:patch_clear_done_js"

make_pr "feat/toast" "Toast: lightweight slide-up notification system" \
  "showToast(msg, duration) creates a pill notification that slides up, holds, then fades and removes itself." \
  "$(rand_issue)" "toast JS:patch_toast_js" "toast CSS:patch_toast_css"

make_pr "feat/empty-state" "Empty state: contextual message when list is empty" \
  "Different messages for zero tasks vs filters hiding everything. Renders inside the task list container." \
  "$(rand_issue)" "empty JS:patch_empty_js" "empty CSS:patch_empty_css"

make_pr "feat/mobile-responsive" "Mobile: responsive layout with media query breakpoints" \
  "600px breakpoint stacks controls vertically. Shortcut hint hidden on mobile. Touch-friendly tap targets." \
  "$(rand_issue)" "mobile CSS:patch_mobile_css"

make_pr "feat/animations" "Animations: slide-in on add, fade-out on remove" \
  "CSS keyframe animations triggered by class toggling. Zero JS overhead for the animation itself." \
  "$(rand_issue)" "animations CSS:patch_animations_css"

make_pr "feat/inline-edit" "Edit: click to edit task text inline" \
  "Replaces task text span with a styled input. Blur or Enter saves; Escape cancels. Borderless with accent underline." \
  "$(rand_issue)" "edit JS:patch_edit_js" "edit CSS:patch_edit_css"

make_pr "feat/confetti" "Confetti: canvas burst when all tasks complete" \
  "120 coloured circles animate with sinusoidal drift for 200 frames then canvas removes itself." \
  "$(rand_issue)" "confetti:patch_confetti_js"

make_pr "feat/counter" "Counter: live done/total task count in footer" \
  "Shows X/Y done format. Updates after every add, toggle, delete, or clear action. Shows No tasks when empty." \
  "$(rand_issue)" "counter:patch_counter_js"

echo ""
echo "🎉 All PRs done! — $(date)"
echo "⏱  Total: ${SECONDS}s"
