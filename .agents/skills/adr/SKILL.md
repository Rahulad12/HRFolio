---
name: adr
description: Create a new Architecture Decision Record or list existing ones
---

# ADR Skill

Input: **$ARGUMENTS**

## Route the command
- `list` or blank → **List**
- starts with `new ` → **New ADR**

---

## List
```bash
ls .agents/decisions/ADR-*.md 2>/dev/null | sort
```

For each file, print: filename, Status line, Date line. Format as a table.

---

## New ADR

### Step 1 — Get next ADR number
```bash
ls .agents/decisions/ADR-*.md 2>/dev/null | wc -l
```
Next number = count + 1 (zero-padded to 3 digits, e.g. `ADR-003`).

### Step 2 — Create the file
Copy `.agents/decisions/ADR-000-template.md` to `.agents/decisions/ADR-<NNN>-<slugified-title>.md`.

Slugify the title: lowercase, spaces to hyphens, remove special characters.

Pre-fill:
- ADR number in the heading
- Title from arguments
- Date: today's date
- Status: `proposed`

### Step 3 — Update the index
Append a row to the index table in `.agents/decisions/README.md`.

### Step 4 — Report
Print the new file path and remind the agent to fill in Context, Options, Decision, and Consequences.
