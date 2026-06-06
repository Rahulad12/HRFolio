    # ADR-002 — Frontend Module Structure

**Status**: accepted
**Date**: 2026-05-30
**Author**: agent

---

## Context

The original client codebase was built as a single-page React app with Redux, components organized by type (pages/, components/, services/) and routes defined in a monolithic router. As the app grew to cover candidates, interviews, assessments, offers, emails, interviewers, and dashboards, the flat structure became difficult to navigate:

- Feature concerns were scattered: candidate API calls in `services/`, candidate types in a shared `types/` file, candidate pages in `pages/`
- Cross-module imports created implicit coupling (e.g., interview pages importing assessment services directly)
- No clear boundary for where a feature's tests, types, or validation schemas should live
- Redux store was global with no module-scoped state
- Adding a new feature required touching 5+ files across the codebase

## Options considered

### Option A — Feature-sliced modules (chosen)
- **Pros**: Each module is self-contained; explicit public API via barrel index; types/api/queries/schemas/components colocated; clear module boundaries enforced by ESLint
- **Cons**: Some duplication of shared types across modules (e.g., EmailTemplate); modules that need cross-module data must duplicate API calls instead of importing directly

### Option B — Keep flat structure with Redux Toolkit slices
- **Pros**: Minimal refactor; familiar to the team
- **Cons**: No module boundary enforcement; cross-contamination continues; tests remain hard to isolate

### Option C — Nx monorepo with shared libs
- **Pros**: Enforced dependency graphs; buildable/publishable libs
- **Cons**: Over-engineered for the current team size; steep learning curve; adds CI complexity

## Decision

**Option A — Feature-sliced modules (client/src/modules/<name>/).** Each module owns its types, Zod schemas, API layer, React Query hooks, components, and page. A barrel `index.ts` exports only what other modules may consume. Cross-module data fetching is done by duplicating minimal API calls (e.g., assessments module fetches candidate list for assignment form).

## Consequences

**Easier:**
- New features have a known home — run `/scaffold <name> client` and fill in the skeleton
- Module boundaries prevent implicit coupling — other modules only access what's in the barrel
- Tests colocated with feature code
- Redux replaced by Zustand + React Query per module
- Adding/removing a module is a single folder operation

**Harder:**
- Shared types (EmailTemplate, CandidateBasic) are duplicated across modules that need them
- No shared UI component library yet — each module may reimplement the same patterns
- Developers must run `/scaffold` (not manually copy) to maintain consistency
- Module-scoped routes must be registered in the main router

**Updated:**
- `client/src/modules/` became the standard feature directory
- `.agents/rules/module-structure.md` documents the pattern
- `.agents/skills/scaffold/` generates the boilerplate
- AGENTS.md feature workflow updated
- ESLint rules enforce no cross-module deep imports

## Related
- Related ADRs: [ADR-001](./ADR-001-server-folder-structure.md)
- Related rules: [`.agents/rules/module-structure.md`](../rules/module-structure.md)
