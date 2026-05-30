---
name: prompt
description: Enhance and refine any draft prompt, issue description, MR body, or agent instruction
---

# Prompt Enhancement Skill

Input: **$ARGUMENTS**

## Step 1 — Classify
| Type | Examples |
|---|---|
| AI task prompt | Prompt sent to an LLM |
| Agent instruction | Step in a SKILL.md or rule file |
| Issue / ticket | GitHub issue body |
| MR description | Merge request summary |
| Commit message | Git commit subject + body |

## Step 2 — Diagnose weaknesses
- Specificity: is the output format stated? Are constraints explicit?
- Context: does the reader have enough background?
- Action clarity: is there one clear thing to do?
- Scope: what is out of scope?
- Success criteria: how does the reader know when done?

## Step 3 — Enhance and return
1. **Enhanced version** — rewritten, ready to use
2. **Changes summary** — 2–5 bullets explaining what changed and why
