## Status
complete

## Active task
Server `src/` restructuring — legacy code migrated to `server/src/legacy/`, TypeScript foundation added.

## What was done this session
- Moved all legacy JS files from `server/` root to `server/src/legacy/` (56 files)
- Created `server/src/index.ts` + `server/src/app.ts` as new TypeScript entry points
- Created `server/tsconfig.json` with strict mode + allowJs
- Installed TypeScript toolchain (`tsx`, `typescript`, `@types/*`)
- Fixed `__dirname` paths in legacy upload.js and uploadRoutes.js
- Refactored legacy index.js to export Express sub-app (no more `app.listen()`)
- Removed `dotenv` import from legacy (now handled by app.ts)
- Updated dev scripts: `nodemon index.js` → `tsx watch src/index.ts`
- Updated `.agents/rules/module-structure.md` — target structure now shows `server/src/`
- Updated `agents.setup.md` — added legacy code bootstrap question + template
- Updated `.agents/rules/api-conventions.md` — path references
- Updated `.agents/wiki/WIKI.md` — server structure, dev commands, deployment guide, technical debt, change log
- Updated `AGENTS.md` — dev command comment
- Verified: server starts, client builds, seeder scripts work
- **Pushed WIKI.md to GitHub Wiki** — initialized wiki via Git Data API (created `refs/wiki/master`), then force-pushed Home.md + _Sidebar.md directly via git. Wiki repo confirmed populated (43671 bytes, 865 lines, fresh clone verified). CDN cache may take ~5-30 min to reflect.

## What is next
- `/context-sync` to refresh codebase map
- Any new server features should be created in `server/src/modules/<name>/` as TypeScript

## Blockers
- None

## Files touched
- `.agents/rules/module-structure.md`
- `.agents/rules/api-conventions.md`
- `.agents/wiki/WIKI.md`
- `agents.setup.md`
- `AGENTS.md`
- `server/src/app.ts` (new)
- `server/src/index.ts` (new)
- `server/tsconfig.json` (new)
- `server/src/legacy/*` (56 files moved)
- `server/package.json`

## Notes
- Legacy JS code wrapped as Express sub-app in `server/src/legacy/index.js`
- New production start: `npm run build && node dist/index.js`
- Uploads path updated for new directory offset
