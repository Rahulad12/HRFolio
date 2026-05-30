# HRFolio — Agent Instructions

**Stack:** React 18 / TypeScript / Vite / Ant Design / Tailwind / Redux Toolkit | Node.js / Express 5 / MongoDB / Mongoose / JWT / Passport
**Repo:** two-package (client/ + server/) | fullstack

---

## Start Here

```bash
/context-sync
cat .agents/sessions/current.md
/taskboard sync
```

Then read `.agents/wiki/mistakes.md`.

---

## Critical Rules

- Branch from `develop`, never push to `main`
- `/scaffold <name> <client|server>` before creating module folders
- `/review` before MR, `/adr new <title>` for architectural decisions
- No cross-module imports, no `any`, no `@ts-ignore` without reason comment
- No `console.log`, no inline styles, no hardcoded colors/URLs
- Form validation via Zod schemas, all UI via Ant Design
- Shared logic in `src/shared/` only
- Update `.agents/sessions/current.md` at session end

---

## Dev Commands

```bash
cd client && npm run dev     # dev
cd client && npm run build   # tsc -b && vite build
cd client && npm run lint    # ESLint
cd server && npm run dev     # tsx watch
cd server && npm start       # production
cd server && npm run data:seed
cd server && npm run data:destroy
```

---

## Feature Workflow

1. `feature/<issue-id>-<slug>` off `develop`
2. Run `/context-sync`, read mistakes.md + current.md, check `.agents/rules/architectural.md` pre-flight checklist
3. `/scaffold <name> <client|server>` — types first, then services, then routes, then component
4. Build: data-fetching with loading/error states, mutations with toast, Zod form validation, `/test-gen <file>` + complete stubs
5. Verify: `/review`, lint, build passes, no cross-package imports, no hardcoded values, update current.md

---

## Skills

| Invoke | What it does |
|---|---|
| `/taskboard [sync\|new <title>\|move #<iid> <col>]` | GitLab board management |
| `/prompt <draft>` | Refine prompts |
| `/scaffold <feature> <package>` | Generate module boilerplate |
| `/review [path]` | Pre-MR self-review |
| `/test-gen <file>` | Generate test stubs |
| `/context-sync` | Rebuild file-tree, deps, symbols |
| `/adr [new <title>\|list]` | Architecture decision records |
| `/security-audit` | 7-category frontend security scan |

---

## Key Files

| File | Package | Purpose |
|---|---|---|
| client/src/routes/ | client | Route definitions |
| client/src/pages/ | client | Pages |
| client/src/services/ | client | API layer |
| client/src/slices/ | client | Redux state |
| client/src/types/ | client | TS types |
| client/src/constant.ts | client | Constants |
| server/routes/ | server | API routes |
| server/controllers/ | server | Request handlers |
| server/model/ | server | Mongoose models |
| server/middleware/ | server | Auth/validation |

Detailed rules: `.agents/rules/` (architectural, module-structure, api-conventions, code-style, security, testing)
Project wiki: `.agents/wiki/WIKI.md`
