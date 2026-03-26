#!/bin/bash
set -e

# ─── CONFIG ───────────────────────────────────────────────────
MAIN="main"
YOUR_NAME="Your Name"
YOUR_EMAIL="you@example.com"    # ← your actual GitHub email

# These show as co-authors on commits (no login needed)
AUTHORS=(
  "$YOUR_NAME <$YOUR_EMAIL>"
  "justepaix <justepaix@users.noreply.github.com>"
  "justepaix <justepaix@users.noreply.github.com>"
  "faza <faza@users.noreply.github.com>"
  "faza <faza@users.noreply.github.com>"
  "$YOUR_NAME <$YOUR_EMAIL>"
)

# ─── HELPERS ──────────────────────────────────────────────────
rand_author() { echo "${AUTHORS[$RANDOM % ${#AUTHORS[@]}]}"; }
human_pause() { sleep $((RANDOM % 8 + 2)); }   # 2–10 sec pause between commits

COMMIT_MSGS=(
  "feat: implement %s"
  "feat: add %s support"
  "fix: resolve issue in %s"
  "style: polish %s styles"
  "refactor: simplify %s logic"
  "chore: clean up %s code"
  "docs: add comments to %s"
  "perf: optimize %s performance"
  "feat: finalize %s feature"
  "fix: edge case in %s handler"
)

rand_msg() {
  local tpl="${COMMIT_MSGS[$RANDOM % ${#COMMIT_MSGS[@]}]}"
  printf "$tpl" "$1"
}

make_commit() {
  local label=$1
  local file=$2
  local content=$3
  echo "$content" >> "$file"
  git add .
  local author; author=$(rand_author)
  local msg; msg=$(rand_msg "$label")
  GIT_AUTHOR_NAME="${author%%<*}" \
  GIT_AUTHOR_EMAIL="${author##*<}" \
  GIT_AUTHOR_EMAIL="${GIT_AUTHOR_EMAIL%%>*}" \
  git commit --author="$author" -m "$msg"
  human_pause
}

make_pr() {
  local branch=$1 title=$2 body=$3 closes=$4 commits=$5
  git checkout $MAIN && git pull origin $MAIN
  git checkout -b "$branch"

  for i in $(seq 1 $commits); do
    make_commit "$branch" "app.js" "// $branch - pass $i - $(date +%s)"
  done

  git push origin "$branch"
  gh pr create --title "$title" --body "$body

$closes" --base $MAIN --head "$branch"
  gh pr merge "$branch" --squash --delete-branch --yes
  git checkout $MAIN && git pull origin $MAIN
  echo "✅ PR merged: $title"
}

# ─── FEATURES → 30 BRANCHES / 100 PRs ────────────────────────
# Format: "branch|title|body|closes|num_commits"

FEATURES=(
  "feat/dark-mode-base|Dark mode: base toggle|Add theme toggle button and class switching|Closes #1|2"
  "feat/dark-mode-css|Dark mode: CSS variables|Add CSS variables for dark theme colors|Closes #1|1"
  "feat/dark-mode-persist|Dark mode: persist preference|Save theme to localStorage|Closes #1|2"
  "feat/storage-save|Storage: save tasks|Write tasks array to localStorage on change|Closes #2|1"
  "feat/storage-load|Storage: load on init|Load saved tasks on page load|Closes #2|2"
  "feat/storage-clear|Storage: clear on reset|Add method to wipe localStorage tasks|Closes #2|1"
  "feat/drag-init|Drag drop: init draggable|Set draggable attr and dragstart events|Closes #3|2"
  "feat/drag-drop-handler|Drag drop: drop handler|Implement drop and reorder logic|Closes #3|2"
  "feat/drag-visual|Drag drop: visual feedback|Add dragging class and opacity effect|Closes #3|1"
  "feat/filter-all|Filters: all filter|Show all tasks when filter is 'all'|Closes #4|1"
  "feat/filter-active|Filters: active filter|Show only incomplete tasks|Closes #4|1"
  "feat/filter-done|Filters: done filter|Show only completed tasks|Closes #4|1"
  "feat/filter-priority|Filters: priority dropdown|Filter tasks by priority level|Closes #13|2"
  "feat/search-input|Search: input field|Add search input to controls bar|Closes #5|1"
  "feat/search-live|Search: live filtering|Filter task list on each keystroke|Closes #5|2"
  "feat/search-clear|Search: clear on empty|Reset list when search is cleared|Closes #5|1"
  "feat/modal-open|Modal: open on click|Show modal when detail button clicked|Closes #6|2"
  "feat/modal-content|Modal: display content|Populate modal with task data|Closes #6|1"
  "feat/modal-close|Modal: close handlers|Close on button click and backdrop click|Closes #6|2"
  "feat/due-date-input|Due dates: input field|Add date picker to add-task form|Closes #7|1"
  "feat/due-date-render|Due dates: render label|Show due date label on task item|Closes #7|2"
  "feat/due-date-overdue|Due dates: overdue highlight|Highlight tasks past their due date|Closes #17|2"
  "feat/priority-badge|Priority: badge styles|Add colored badge for each priority|Closes #8|2"
  "feat/priority-render|Priority: render on task|Show priority badge on each task item|Closes #8|1"
  "feat/export-json|Export: JSON download|Serialize tasks and trigger file download|Closes #9|2"
  "feat/keyboard-enter|Keyboard: enter to add|Submit task on Enter key in input|Closes #10|1"
  "feat/keyboard-escape|Keyboard: escape to close|Close modal on Escape key|Closes #10|1"
  "feat/keyboard-dark|Keyboard: ctrl+d theme|Toggle dark mode with Ctrl+D shortcut|Closes #10|1"
  "feat/clear-done|Clear done button|Remove all completed tasks at once|Closes #11|2"
  "feat/task-counter|Task counter|Show total task count in footer|Closes #12|1"
  "feat/empty-state|Empty state message|Show message when task list is empty|Closes #16|2"
  "feat/mobile-breakpoints|Mobile: media queries|Add responsive breakpoints for small screens|Closes #15|2"
  "feat/mobile-flex|Mobile: flex layout|Stack controls vertically on mobile|Closes #15|1"
  "feat/animation-add|Animation: task add|Slide-in animation when task is added|Closes #14|2"
  "feat/animation-remove|Animation: task remove|Fade-out when task is deleted|Closes #14|1"
  "feat/edit-inline|Edit: inline input|Replace task text with input on edit click|Closes #18|2"
  "feat/edit-save|Edit: save on blur|Save edited text on blur or Enter|Closes #18|2"
  "feat/confetti-trigger|Confetti: detect all done|Check if all tasks complete after toggle|Closes #19|1"
  "feat/confetti-render|Confetti: canvas burst|Render confetti burst on completion|Closes #19|3"
  "feat/shortcut-hint|UI: keyboard hint bar|Add shortcut hint strip at bottom of screen|Closes #10|1"
)

# ─── RUN ──────────────────────────────────────────────────────
echo "🚀 Starting PR generation — $(date)"
echo "Total features: ${#FEATURES[@]}"

for feature in "${FEATURES[@]}"; do
  IFS='|' read -r branch title body closes commits <<< "$feature"
  make_pr "$branch" "$title" "$body" "$closes" "$commits"
done

echo ""
echo "🎉 All done! Check your repo on GitHub."
echo "Total time: $SECONDS seconds"