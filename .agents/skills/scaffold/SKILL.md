---
name: scaffold
description: Generate module boilerplate for a new feature in the correct package, following module-structure.md exactly
---

# Scaffold Skill

Input: **$ARGUMENTS**

Parse module name and target package from arguments.

## Step 1 — Read the rules
Read `.agents/rules/module-structure.md` and identify the correct folder tree for the target package.
Check project scope — skip sections that don't apply.

## Step 2 — Determine paths
- `client` → `client/src/modules/<module-name>/`
- `server`  → `server/src/modules/<module-name>/`

Note: New modules go into `modules/` subdirectory under `src/`.

## Step 3 — Create folder structure

### Client (frontend)
```bash
mkdir -p client/src/modules/<module-name>/types
mkdir -p client/src/modules/<module-name>/schemas
mkdir -p client/src/modules/<module-name>/utils
mkdir -p client/src/modules/<module-name>/hooks
mkdir -p client/src/modules/<module-name>/lib/api
mkdir -p client/src/modules/<module-name>/lib/queries
mkdir -p client/src/modules/<module-name>/lib/mutations
mkdir -p client/src/modules/<module-name>/routes
mkdir -p client/src/modules/<module-name>/components
```

### Server (backend)
```bash
mkdir -p server/src/modules/<module-name>/types
mkdir -p server/src/modules/<module-name>/routes
mkdir -p server/src/modules/<module-name>/controller
mkdir -p server/src/modules/<module-name>/services
```

## Step 4 — Create stub files

### Client stubs
- `index.ts` — barrel with placeholder typed exports
- `page.tsx` — stub page component with React.FC type
- `types/<module>.types.ts` — empty type file with a placeholder interface
- `schemas/<module>.schema.ts` — Zod schema with `.default()` values
- `utils/<page>.helper.ts` — one placeholder pure function stub with explicit return type
- `hooks/use<Module>.ts` — stub typed hook
- `lib/api/<module>-<domain>.api.ts` — stub axios async function with explicit Promise<T> return type
- `lib/queries/<module>-<domain>.queries.ts` — stub query options
- `lib/mutations/<module>-<domain>.mutations.ts` — stub mutation options
- `routes/<module>.routes.tsx` — stub route definition array
- `components/<Module>Form.tsx` — stub form component with typed props
- `components/<Module>Table.tsx` — stub table component with typed props

### Server stubs
- `index.ts` — registers router + re-exports types
- `types/<module>.types.ts` — request DTO interface + response DTO interface
- `routes/<module>.routes.ts` — stub router with one placeholder route
- `controller/<module>.controller.ts` — stub controller function with typed Request/Response
- `services/<module>.service.ts` — stub service function with explicit Promise<ResponseDTO> return type

## Step 5 — Report
List all created files with their full paths. Remind the agent to:
- Register the route (client router or server index.js)
- Fill in the TODO stubs
- Run `/test-gen` on the service file
