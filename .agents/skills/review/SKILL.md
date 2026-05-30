---
name: review
description: Pre-MR self-review — checks code quality, rule compliance, test coverage, and generates an MR description
---

# Review Skill

Input: **$ARGUMENTS** (path or blank)

## Step 1 — Get the diff
```bash
git diff HEAD~1 --name-only 2>/dev/null || git diff --cached --name-only
git diff HEAD~1 2>/dev/null || git diff --cached
```

## Step 2 — Run automated checks
```bash
cd client && npm run lint 2>&1 | tail -20
```

## Step 3 — Manual checklist (read diff and check each)

### Code quality
- [ ] No `console.log` statements
- [ ] No `// @ts-ignore` without reason comment
- [ ] No `any` types — use `unknown` + type guards
- [ ] No hardcoded colors or inline styles
- [ ] No cross-package imports (client → server, server → client)

### Architecture
- [ ] Folder structure matches module-structure.md
- [ ] No business logic in controllers / route handlers / page components
- [ ] Shared components extracted when used by 2+ modules

### Security
- [ ] No secrets or tokens in code
- [ ] All inputs validated before use
- [ ] Auth middleware present on protected routes

### Tests
- [ ] Test file exists for every new service and hook
- [ ] Happy-path test present
- [ ] At least one error-path test present

### Documentation
- [ ] If architectural decision was made: ADR exists in `.agents/decisions/`

## Step 4 — Output the review

Report: PASS or list of issues to fix.

## Step 5 — Generate MR description

```markdown
## What
[one-line summary of what changed]

## Why
Closes #[issue-iid]

## How to test
1. [step]
2. [step]

## Checklist
- [ ] Tests pass
- [ ] Lint passes
- [ ] Self-review complete (/review)
```
