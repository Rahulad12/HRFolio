# Session Handoff

`current.md` is the active task state. It must be updated at the end of every session
so the next session (or a new agent) can resume without losing context.

## Format

```markdown
## Status
[in-progress | blocked | ready-for-review | complete]

## Active task
Issue: #[iid] — [title]
Branch: [branch name]

## What was done this session
- [bullet list of completed steps]

## What is next
- [bullet list of remaining steps]

## Blockers
- [any unresolved blockers, or "none"]

## Files touched
- [list of modified files]

## Notes
[anything the next session needs to know that doesn't fit above]
```
