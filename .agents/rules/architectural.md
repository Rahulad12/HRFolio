---
paths:
  - "src/**"
  - "client/src/**"
  - "server/**"
---
# Architectural Pre-Flight Checklist

Complete every phase in order before writing a single line of code for any new feature.

---

## Phase 1 — Understand
- [ ] Read `.agents/wiki/mistakes.md` — check for known pitfalls relevant to this task
- [ ] Read `.agents/sessions/current.md` — understand what was in progress
- [ ] Run `/context-sync` — ensure `.agents/context/` is fresh
- [ ] Identify which **package(s)** are affected (client, server, or both)
- [ ] Confirm the type of change: new module · new page · update existing · service-only · cross-package
- [ ] Find the most similar existing code in the same package and read it
- [ ] List all API endpoints needed (method, path, request shape, response shape)
- [ ] If cross-package: define the API contract in shared types first
- [ ] If architectural decision required: run `/adr new <title>` before writing code

> **Exit gate:** state the file list with package paths before creating anything.

---

## Phase 2 — Scaffold
- [ ] Run `/scaffold <feature-name> <client|server>` — do not create folders manually
- [ ] Write type definitions first (shared types for cross-package use)
- [ ] Write service/API functions (raw, no UI)
- [ ] Write route/navigation registration
- [ ] Create a minimal stub component so the build passes

> **Exit gate:** build passes with stub content.

---

## Phase 3 — Build
- [ ] Write data-fetching logic with loading and error states
- [ ] Write mutation logic with success toast + state updates
- [ ] Write the main page/component
- [ ] Write form with validation
- [ ] Extract stateful elements into own components
- [ ] Avoid `useEffect` — only use for genuine external system sync with a justification comment
- [ ] Run `/test-gen <service-file>` to generate test stubs, then complete them

> **Exit gate:** page renders, data loads, all interactions work end-to-end.

---

## Phase 4 — Verify
### Code quality
- [ ] Run `/review` — fix every flagged issue before continuing
- [ ] Lint — zero errors (client: `npm run lint`, server: check with ESLint)
- [ ] Build — passes for all affected packages

### Data correctness
- [ ] All filters send params to the API — no client-side `.filter()` on response data
- [ ] Loading and error states handled

### Architecture compliance
- [ ] No relative imports across package boundaries
- [ ] No `console.log` in committed code
- [ ] No hardcoded color values or inline styles
- [ ] No `// @ts-ignore`
- [ ] Folder tree matches scaffold output for each package
- [ ] Shared logic not duplicated across packages

### Session close
- [ ] Update `.agents/sessions/current.md` with what was done and what is next
- [ ] If any rework was required: append to `.agents/wiki/mistakes.md`
- [ ] Branch is `develop` or `feature/<id>-slug`

> **Exit gate:** all boxes checked. Commit and open MR targeting `develop`.
