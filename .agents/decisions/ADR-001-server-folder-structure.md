# ADR-001 — Server Folder Structure

**Status**: accepted
**Date**: 2026-05-30
**Author**: agent

---

## Context

The server codebase was originally flat JavaScript files spread across `server/` root (controllers/, model/, routes/, middleware/, etc.). The client already used `client/src/` with a clean TypeScript structure. The server lacked:

- TypeScript support for new features
- A clear separation between legacy JS code and new TS modules
- An entry point structure that could mount both legacy and new code
- Parity with the client's `src/` convention

## Options considered

### Option A — Rewrite everything in TypeScript
- **Pros**: Clean slate, no legacy debt
- **Cons**: Massive effort (~56 files), blocks all other work, high risk of regression

### Option B — Move legacy JS to `server/src/legacy/`, new TS to `server/src/modules/`
- **Pros**: Zero rewrite risk; legacy keeps working; new features get TS; mirrors `client/src/` convention; incremental migration path
- **Cons**: Two paradigms coexist (JS + TS); `__dirname` paths need offset fixes; devs must know which folder to use

### Option C — Keep flat structure, add TS alongside JS
- **Pros**: Minimal churn
- **Cons**: No organization principle; TS/JS files mixed; no clear migration path

## Decision

**Option B.** Move all legacy JS files into `server/src/legacy/` and create `server/src/modules/` for new TypeScript features. Create `server/src/app.ts` (Express app factory) and `server/src/index.ts` (entry point) to mount both.

## Consequences

**Easier:**
- New features get TypeScript with strict mode
- Clear convention: JS in `legacy/`, TS in `modules/`
- Client `src/` pattern extended to server → consistent mental model
- Incremental migration: legacy files can be ported to TS one at a time

**Harder:**
- `__dirname` offsets needed in legacy upload paths (moved deeper by one level)
- Developers must be aware of the split (documented in AGENTS.md and wiki)
- Build/start scripts had to change (`tsx watch src/index.ts`, `tsc` → `node dist/index.js`)

**Updated:**
- Dev scripts in `server/package.json`
- `tsconfig.json` (strict, allowJs)
- `.agents/rules/module-structure.md`
- `.agents/wiki/WIKI.md`
- AGENTS.md dev commands

## Related
- Related rules: [`.agents/rules/module-structure.md`](../rules/module-structure.md)
