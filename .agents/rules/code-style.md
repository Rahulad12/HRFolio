---
paths:
  - "**/*.ts"
  - "**/*.tsx"
  - "**/*.js"
  - "**/*.jsx"
---
# Code Style

## Naming
- Files and folders: Kebab case: `kebab-case`
- Component files: PascalCase (must match the component export name)
- Utility files: kebab-case
- Custom hooks: camelCase with `use` prefix
- Constants: UPPER_SNAKE_CASE
- Types/Interfaces: PascalCase
- Event handlers: camelCase with `on` prefix (e.g., `onSubmit`, `onClick`)


## File Suffixes

Always use suffixes to make the file purpose immediately obvious without opening it:

| File type | Example |
|---|---|
| Types | `invoice.types.ts` |
| Utils | `invoice.utils.ts` |
| Helper functions | `invoice.helper.ts` |
| API functions | `invoice.api.ts` |
| Query options | `invoice.queries.ts` |
| Mutation options | `invoice.mutations.ts` |
| Zod schemas | `invoice.schema.ts` |
| Hooks | `use-invoice-filters.ts` |
| Tests | `invoice-table.test.tsx` |
| Skeletons | `invoice-table-skeleton.tsx` |
| Empty states | `invoice-empty-state.tsx` |

**Helper function placement:**
- Page-level helpers: `<module>/utils/<page>.helper.ts`
- Shared across modules: `src/shared/utils/<name>.helper.ts`
- Module-internal sharing: `<module>/utils.ts`

## Imports
- Use workspace aliases across packages — never `../../` across package boundaries
- Within a package: use the package's configured path alias (or `src/`)
- Group: external libs → workspace packages → `src/shared/` → `src/modules/` → local module files

## TypeScript (strictly enforced on all layers)
- `tsconfig.json` must have `"strict": true` and `"noImplicitAny": true`
- No `any` — use `unknown` + type guards, or define the type explicitly
- No `@ts-ignore` without a `// reason:` comment on the same line
- No `@ts-expect-error` without a comment explaining why it is expected
- No `as T` type assertions as a substitute for proper typing
- Explicit return types on all exported functions
- Derive form types from schema: `z.infer<typeof schema>` or equivalent
- Hooks return typed data — never `unknown` or `any` in hook signatures
- Service functions return `Promise<T>` — never `Promise<any>`

## React
- Functional components only
- Custom hooks for all stateful logic
- No inline event handlers longer than one line — extract to function
- Components typed with explicit prop types
- Props destructured in function signature for clarity

## UI Components
- Always use shadcn components
- Never use inline styles or CSS-in-JS for styling — use Tailwind classes only
- No custom styled components unless in `.agents/decisions/` ADR

## Styling
- All styling via Tailwind utility classes
- No `style={{}}` inline props
- No hardcoded color values — always use CSS variables defined in `tailwind.config.ts`

## Banned patterns
- No direct HTTP client calls in components — use the service layer
- No `localStorage` access outside the designated utility
- No hardcoded URL strings — use config constants in `src/shared/constants/`
- No hardcoded colors or inline styles
- No `console.log` in committed code
- No `// @ts-ignore` without reason comment
- No business logic in route handlers or page components
- No cross-module imports — modules never import from each other directly
- No large components — split at the module boundary (max ~300 lines per component)
