# .agents/ — Master Navigation

Everything agents needs to work on HRFolio lives here, plus `AGENTS.md` at the repo root.

---

## Quick reference

| I need to… | Go to |
|---|---|
| Start a session | `cat .agents/sessions/current.md` then `/context-sync` |
| Understand the project | `.agents/wiki/WIKI.md` |
| Avoid repeating past mistakes | `.agents/wiki/mistakes.md` |
| Start a new feature | `.agents/rules/architectural.md` then `/scaffold` |
| Check folder structure rules | `.agents/rules/module-structure.md` |
| Check data fetching patterns | `.agents/rules/api-conventions.md` |
| View current task board | `.agents/taskboard/TASKBOARD.md` |
| See why a decision was made | `.agents/decisions/` |
| Run a security audit | `/security-audit` |
| Deploy or rollback | `.agents/runbooks/` |
| See live file/symbol map | `.agents/context/` |

---

## Structure

```
.agents/
├── README.md
├── rules/                   ← coding rules (6 files)
├── wiki/                    ← project knowledge base + mistakes log
├── decisions/               ← architecture decision records (ADRs)
├── context/                 ← auto-generated codebase map
├── sessions/                ← task handoff between agent sessions
├── runbooks/                ← deploy, rollback, incident, feature flags
├── taskboard/               ← live GitHub board mirror
├── skills/                  ← 8 skills, each with .skill + SKILL.md
└── raw/                     ← immutable source documents for wiki ingestion
```

## Rules — how they load

| Rule | Applies to |
|---|---|
| `architectural.md` | module and route files across all packages |
| `code-style.md` | all source files |
| `api-conventions.md` | service / API / hook files |
| `module-structure.md` | module, route, service files in ALL packages |
| `security.md` | auth, config, API files |
| `testing.md` | test and spec files |
