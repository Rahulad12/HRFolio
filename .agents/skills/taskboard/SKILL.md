---
name: taskboard
description: View, sync, and manage the GitHub task board (issues) — sync, create, and move issues
---

# Task Board

GitHub: https://github.com/Rahulad12/HRFolio
Local board file: `.agents/taskboard/TASKBOARD.md`
Command: **$ARGUMENTS**

## Route the command
- blank / `show` → **Show**
- `sync` → **Sync**
- starts with `new ` → **New Issue**
- starts with `move ` → **Move**

## Show
Read and print `.agents/taskboard/TASKBOARD.md`. If missing, run Sync.

## Sync

### 1. Fetch issues (requires `gh` CLI authenticated)
```bash
gh issue list --state all --limit 50 --json number,title,state,labels,url,milestone
```

### 2. Categorize
- `state=closed` → Done
- `state=open` + label `in-progress` → In Progress
- `state=open` → To Do

### 3. Write TASKBOARD.md with current date and all columns

## New Issue
Parse title from `new <title>`. Create issue with label `to-do`.
```bash
gh issue create --title "<title>" --label "to-do"
```

## Move Issue
Parse `move #<iid> <todo|in-progress|done>`.
- `todo` → add `to-do` label, remove `in-progress`
- `in-progress` → add `in-progress` label, remove `to-do`
- `done` → close the issue
Run full Sync to rebuild board.
