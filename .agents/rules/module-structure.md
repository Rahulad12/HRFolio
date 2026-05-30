---
paths:
  - "client/src/**"
  - "server/**"
---
# Module Structure — Feature-Based Modular Architecture

> Always run `/scaffold <feature-name> <client|server>` instead of creating folders manually.
> TypeScript is mandatory and strictly enforced — no exceptions.

---

## Top-level layout

```
HRFolio/
├── client/          ← React / Vite frontend
└── server/          ← Node / Express backend
```

---

## TypeScript Contract (applies to every file, both layers)

- `tsconfig.json` must have `"strict": true` and `"noImplicitAny": true`
- No `@ts-ignore` without an accompanying `// reason:` comment on the same line
- No `@ts-expect-error` without a comment explaining why it is expected
- No `as T` type assertions as a substitute for proper typing
- All exported functions must have explicit return types
- Hooks return typed data — never `unknown` or `any` in a hook signature
- Service functions return `Promise<T>` — never `Promise<any>`
- DTOs and response types always explicitly defined — never expose raw API model shapes to callers
- Form types derived from schema: `z.infer<typeof schema>` — never hand-rolled duplicates
- Barrel `index.ts` files must re-export with explicit types

---

## SECTION A — Frontend (client/)

### `src/` layout

```
src/
├── shared/          ← cross-module utilities, types, hooks, constants, components
│   ├── types/       ← shared types and interfaces used by 2+ modules
│   ├── utils/       ← pure helper functions, formatters, validators
│   ├── constants/   ← app-wide enums, config values, route path constants
│   ├── hooks/       ← hooks used by 2+ modules (useAuth, useToast, useApi)
│   └── components/  ← truly reusable UI (Button wrapper, Modal, Table, Input, Layout)
└── modules/         ← all feature modules live here
    ├── <module-a>/
    ├── <module-b>/
    └── <module-c>/
```

**Key rule:** `shared/` is a sibling of `modules/` under `src/` — it is never nested inside a module folder.

---

### Existing structure (legacy — maintained as-is)

```
client/src/
├── action/          ← Redux action creators
├── assets/          ← Static assets
├── component/       ← Shared UI components
├── data/            ← Static/dummy data
├── Hooks/           ← Custom hooks
├── pages/           ← Page-level components
├── routes/          ← Route definitions
├── services/        ← API service layer
├── slices/          ← Redux Toolkit slices
├── types/           ← TypeScript type definitions
├── utils/           ← Utility/helper functions
├── constant.ts      ← App constants
├── store.ts         ← Redux store config
├── App.tsx          ← Root component
└── main.tsx         ← Entry point
```

---

### Target structure for NEW features

#### `src/shared/` — cross-module only

```
src/
└── shared/
    ├── types/          ← interfaces and types used by 2+ modules
    ├── utils/          ← pure helper functions, formatters, validators
    ├── constants/      ← app-wide enums, config values, route path constants
    ├── hooks/          ← hooks used by 2+ modules (e.g. useAuth, useToast, useApi)
    └── components/     ← truly reusable UI (Button, Modal, Table, Input, Layout wrapper)
```

Rules for `shared/`:
- A component or hook belongs here **only if used by two or more modules**
- No module-specific business logic or API calls
- All exports explicitly typed — no inferred `any`
- No imports from any module folder
- No module-specific styles or dependencies

#### `src/modules/` — one folder per domain feature

```
src/
└── modules/
    └── <module-name>/
        ├── index.ts                    ← barrel: re-exports the public API of this module
        ├── page.tsx                    ← route-level component — one per module entry point
        ├── types/                      ← types and interfaces scoped to this module only
        │   └── <module>.types.ts
        ├── schemas/                    ← Zod schemas for validation & API validation
        │   └── <module>.schema.ts
        ├── utils/                      ← helpers scoped to this module only
        │   └── <page>.helper.ts        ← page-level helpers
        ├── hooks/                      ← hooks used within this module only
        │   └── use<Module>.ts
        ├── lib/                        ← API, queries, mutations
        │   ├── api/
        │   │   ├── <module>-<domain>.api.ts    ← one file per domain concern
        │   │   └── index.ts                     ← barrel re-exports all api files
        │   ├── queries/
        │   │   ├── <module>-<domain>.queries.ts
        │   │   └── index.ts
        │   └── mutations/
        │       ├── <module>-<domain>.mutations.ts
        │       └── index.ts
        ├── routes/                     ← module route definitions
        │   └── <module>.routes.tsx
        └── components/                 ← module-specific components
            ├── <Module>Form.tsx
            ├── <Module>Table.tsx
            └── <Module>Card.tsx
```

Rules for module folders:
- **Components inside a module are not shared globally.** If another module needs the same UI, move it to `src/shared/components/`
- `page.tsx` is the only file imported by the router — it composes everything else in the module
- `types/` may import from `src/shared/types/` but **never from another module**
- `schemas/` defines Zod schemas — used for both form validation (Ant Design Form) and API request validation; types inferred via `z.infer<typeof schema>`, never hand-rolled
- `schemas/` must define `.default()` values for all form fields where applicable
- `lib/api/` **MUST use axios** via the project's shared HTTP wrapper — never use fetch or direct axios imports
- **`lib/api/`, `lib/queries/`, `lib/mutations/`, and `components/` MUST group files by domain concern** — never put all functions into a single flat file. Split by subdomain as soon as more than one concern exists and add a barrel `index.ts`. Example:
  ```
  lib/api/
  ├── invoice-list.api.ts      ← fetchInvoices, getInvoiceById, …
  ├── invoice-pdf.api.ts       ← downloadInvoicePdf, previewInvoicePdf
  ├── invoice-payment.api.ts   ← payInvoice, refundInvoice
  └── index.ts                 ← re-exports everything
  ```
- Form components use **Ant Design Form** with `onFinish` — validate using Zod schemas before submission
- `lib/` functions call only the axios HTTP wrapper — no business logic, no hooks
- `hooks/` imports from `lib/` via the module barrel (`index.ts`) — never deep-imports internals
- State management uses **Redux Toolkit** (existing pattern) — module-level Redux slices go in `src/slices/`; colocated slices in `store/` are not used
- **Helper functions:** page-level helpers go in `<module>/utils/<page>.helper.ts`; shared across modules in `src/shared/utils/`; module-internal sharing in `<module>/utils.ts`
- React components use explicit prop types: `const X: React.FC<Props>` or inline `({ foo }: { foo: string })`
- No cross-module imports — `modules/trades/` never imports from `modules/users/`

#---

### Routing

#### Mode

Declarative mode using `createBrowserRouter`. No `loader` or `action` functions — React Query owns all data fetching.

#### Root Router

```ts
// routes/index.tsx
import { createBrowserRouter } from 'react-router'
import { invoiceRoutes } from '@/modules/invoices/routes/invoice.routes'
import { authRoutes } from '@/modules/auth/routes/auth.routes'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        element: <ProtectedRoute />,
        children: [
          ...invoiceRoutes,
          ...dashboardRoutes,
        ],
      },
      ...authRoutes,   // public routes outside ProtectedRoute
    ],
  },
])
```

#### Module Route Files

Each module defines its own routes and exports them as a named array:

```ts
// modules/invoices/routes/invoice.routes.tsx
export const invoiceRoutes = [
  {
    path: 'invoices',
    element: <InvoiceListPage />,
  },
  {
    path: 'invoices/:id',
    element: <InvoiceDetailPage />,
  },
]
```

#### Protected Routes

Auth protection is declared at the route level using the `ProtectedRoute` wrapper from `shared/components/`. Never handle auth redirects inside individual page components.

```tsx
// shared/components/protected-route.tsx
export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) return <PageLoader />
  if (!isAuthenticated) return <Navigate to="/login" replace />

  return <Outlet />
}
```

#### Lazy Loading

All page-level components must be lazy loaded. Heavy non-route components (charts, rich text editors, maps, data grids) must also be lazy loaded.

```ts
// Lazy load all pages
const InvoiceListPage = lazy(() => import('../pages/invoice-list'))
const InvoiceDetailPage = lazy(() => import('../pages/invoice-detail'))
```

##### Suspense Boundaries

**Route level** — one `Suspense` wrapping the entire router with a full-page fallback:

```tsx
<Suspense fallback={<PageLoader />}>
  <RouterProvider router={router} />
</Suspense>
```

**Heavy component level** — local `Suspense` when lazy loading non-route components within a page:

```tsx
<Suspense fallback={<ChartSkeleton />}>
  <HeavyChartComponent />
</Suspense>
```

Always use a relevant skeleton as the fallback — not a generic spinner — for heavy component boundaries.

#### URL State

Filters, pagination, search, and sort order all live in the URL via **nuqs**.

#### Navigation Links

**ALWAYS use `Link` from `react-router` for client-side navigation — never use `<a>` anchor tags.**

`<a>` tags cause full page reloads. `Link` keeps the app mounted and performs client-side navigation.

```tsx
import { Link } from 'react-router'

// ✅ Correct - client-side navigation (no page reload)
<Link to="/login">Login</Link>
<Link to="/register">Register</Link>

// ❌ Wrong - full page reload
<a href="/login">Login</a>
```

##### Dynamic Links

```tsx
// ✅ With parameters
<Link to={`/invoices/${invoice.id}`}>View Invoice</Link>

// ✅ With query params
<Link to="/invoices?page=2">Next Page</Link>

// ✅ Programmatic navigation (in handlers)
import { useNavigate } from 'react-router'

const navigate = useNavigate()
navigate('/dashboard') // instead of window.location.href = '/dashboard'
```

##### Navigation Rules Summary

| Scenario | Use | Don't Use |
|---|---|---|
| Linking between routes | `<Link to="..." />` | `<a href="...">` |
| Programmatic navigation | `navigate('/path')` | `window.location.href` |
| External links | `<a href="https://...">` | `<Link>` (won't work) |
| Page reload needed | `window.location.reload()` | `navigate()` |

---

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

#### `index.ts` barrel pattern

```typescript
// Export types
export type { InvoiceFormData, InvoiceListItem } from './types/invoice.types';

// Export schemas (types inferred via z.infer)
export { invoiceSchema, createInvoiceSchema } from './schemas/invoice.schema';

// Export components
export { InvoicePage } from './page';
export { InvoiceForm } from './components/InvoiceForm';
export { InvoiceTable } from './components/InvoiceTable';

// Export hooks
export { useInvoiceList } from './hooks/useInvoiceList';
export { useInvoiceCreate } from './hooks/useInvoiceCreate';

// Export routes
export { invoiceRoutes } from './routes/invoice.routes';

// Export API layer
export * as invoiceApi from './lib/api/invoice-list.api';
export * as invoiceQueries from './lib/queries/invoice.queries';
export * as invoiceMutations from './lib/mutations/invoice.mutations';
```

---

#### Routing registration

Route registration lives in `client/src/routes/` (or `App.tsx`).
Import only from the module's `index.ts` barrel — never from internal module paths.

```typescript
import { InvoicePage } from 'src/modules/invoices';

const routes = [
  { path: '/invoices', element: <InvoicePage /> },
];
```

---

#### What belongs in `src/shared/` vs `src/modules/<module>/`

| Content | `src/shared/` | `src/modules/<module>/` |
|---|---|---|
| Button, Input, Modal (generic wrapper) | ✅ used by 2+ modules | ❌ |
| InvoiceStatusTag (invoice-specific) | ❌ | ✅ modules/invoices/components/ |
| useAuth, useToast, useApi | ✅ | ❌ |
| useInvoiceFilters, useInvoiceSearch | ❌ | ✅ modules/invoices/hooks/ |
| API base URL, env constants | ✅ | ❌ |
| Invoice status enum | ❌ | ✅ modules/invoices/types/ |
| Date formatter, string utilities | ✅ | ❌ |
| Invoice validation schema (Zod) | ❌ | ✅ modules/invoices/schemas/ |
| Pagination helper | ✅ if used by 2+ modules | ❌ |
| Invoice API, queries, mutations | ❌ | ✅ modules/invoices/lib/ |

**Decision rule:** if you find yourself copying a file from one module to another, that file belongs in `src/shared/`. Do not duplicate — move it.

---

## SECTION B — Backend (server/)

> Path: `server/`
> Framework: Express 5
> Database / ORM: MongoDB / Mongoose 8

### Existing structure (legacy — maintained as-is)

```
server/
├── config/          ← DB connection, Passport config
├── controllers/     ← Request handlers
├── Data/            ← Seed data
├── logs/            ← Winston log files
├── middleware/      ← Express middleware
├── model/           ← Mongoose models
├── routes/          ← Route definitions
├── uploads/         ← File uploads
├── utils/           ← Logger, helpers
├── index.js         ← Entry point
└── upload.js        ← Upload handler
```

### Target structure for NEW features

```
server/
└── modules/
    └── <module-name>/
        ├── index.ts                    ← routes + exports
        ├── types/
        │   └── <module>.types.ts
        ├── routes/
        │   └── <module>.routes.ts
        ├── controller/
        │   └── <module>.controller.ts
        └── services/
            └── <module>.service.ts
```

Layer responsibilities:

| Layer | Allowed | Forbidden |
|---|---|---|
| `routes` | Register paths, attach middleware | Any logic, DB access |
| `controller` | Parse req, call service, send res | Business logic, DB access |
| `services` | All business logic, DB/ORM calls | HTTP concerns, req/res objects |

---

## Cross-boundary import rules

```
client/  →  server/                       ❌ NEVER
server/  →  client/                       ❌ NEVER
src/modules/<any>   →  src/shared         ✅ allowed
src/shared          →  src/modules/<any>   ❌ NEVER
src/modules/a       →  src/modules/b       ❌ NEVER — move to shared if needed
```

---

## Prohibited actions (all layers)

- Never add a component to a module if it is already used elsewhere — move it to `src/shared/`
- Never import from `../module-b/` inside `module-a/` — no cross-module imports
- Never put business logic in a component or page file
- Never rename files without updating `index.ts` barrels and `.agents/context/`
- Never use `any` — use `unknown` + type guards or define the type explicitly
- Never store environment-specific values as hard-coded strings — use `src/shared/constants/`
- Never add a new top-level folder without documenting it in the wiki and creating an ADR
- Never create `shared/` inside a module folder — it belongs at `src/shared/`
- Never import from a module's `components/` or `lib/` directly — always use the barrel
- Never put all API/query/mutation/component files into one catch-all file — always split by domain concern and group with a barrel `index.ts`
- Never use `console.log` in committed code — use the Winston logger (server) or a proper logging utility (client)
- Never hardcode environment-specific values — use `.env` variables
