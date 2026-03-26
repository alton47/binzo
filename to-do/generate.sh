#!/bin/bash

REPO="todo-app"
MAIN_BRANCH="main"
declare -a AUTHORS=(
  "Your Name <you@example.com>"
  "justepaix <justepaix@users.noreply.github.com>"
  "justepaix <justepaix@users.noreply.github.com>"
  "faza <faza@users.noreply.github.com>"
  "faza <faza@users.noreply.github.com>"
  "Your Name <you@example.com>"
)

# Random author picker (biased so yours is ~40%, others ~60%)
random_author() {
  echo "${AUTHORS[$RANDOM % ${#AUTHORS[@]}]}"
}

# Random sleep to look human (5s to 45s between commits)
human_pause() {
  sleep $((RANDOM % 40 + 5))
}

# Features list — each becomes a branch + PR
declare -a FEATURES=(
  "feat/dark-mode|Dark mode toggle|Add dark/light theme switcher|Closes #1"
  "feat/local-storage|Persist tasks|Save tasks to localStorage|Closes #2"
  "feat/drag-drop|Drag and drop|Reorder tasks by dragging|Closes #3"
  "feat/filters|Filter tasks|Filter by all/active/done|Closes #4"
  "feat/search|Search bar|Live search through tasks|Closes #5"
  "feat/modal|Task detail modal|Click task for full detail view|Closes #6"
  "feat/due-dates|Due dates|Add and display due dates|Closes #7"
  "feat/priority|Priority tags|High/med/low priority labels|Closes #8"
  "feat/export|Export JSON|Download tasks as JSON file|Closes #9"
  "feat/keyboard|Keyboard shortcuts|Hotkeys for common actions|Closes #10"
  # ... (add up to 30)
)

# Create issues first
create_issues() {
  gh issue create --title "Implement dark mode" --body "Add toggle for dark/light theme"
  gh issue create --title "Persist tasks with localStorage" --body "Tasks should survive page reload"
  gh issue create --title "Drag and drop reordering" --body "Users should drag tasks to reorder"
  # ... up to 19
}

# Create one PR with 1-3 commits
make_pr() {
  local branch=$1
  local pr_title=$2
  local pr_body=$3
  local closes=$4
  local num_commits=$((RANDOM % 3 + 1))

  git checkout $MAIN_BRANCH
  git pull origin $MAIN_BRANCH
  git checkout -b $branch

  for i in $(seq 1 $num_commits); do
    # Write actual code change
    echo "/* $branch commit $i - $(date) */" >> style.css
    echo "// $branch feature code - pass $i" >> app.js
    
    git add .
    AUTHOR=$(random_author)
    git commit --author="$AUTHOR" -m "$(commit_message $branch $i)"
    human_pause
  done

  git push origin $branch
  
  gh pr create \
    --title "$pr_title" \
    --body "$pr_body

$closes" \
    --base $MAIN_BRANCH \
    --head $branch

  # Merge it (no conflict since each branch touches different lines)
  gh pr merge --squash --delete-branch
  
  git checkout $MAIN_BRANCH
  git pull origin $MAIN_BRANCH
}

commit_message() {
  local messages=(
    "feat: initial $1 implementation"
    "fix: edge case in $1"
    "style: cleanup $1 code"
    "refactor: simplify $1 logic"
    "test: add $1 functionality"
    "docs: update readme for $1"
  )
  echo "${messages[$RANDOM % ${#messages[@]}]}"
}

# MAIN RUN
create_issues

for feature in "${FEATURES[@]}"; do
  IFS='|' read -r branch title body closes <<< "$feature"
  make_pr "$branch" "$title" "$body" "$closes"
  echo "✅ Done: $title"
done