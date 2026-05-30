---
paths:
  - "client/src/modules/**/lib/**"
  - "client/src/shared/lib/**"
  - "client/src/shared/hooks/**"
  - "client/src/shared/store/**"
  - "server/src/controllers/**"
  - "server/src/routes/**"
  - "server/src/middleware/**"
---

# API Conventions

## Stack Overview

| Concern | Tool | Migration Status |
|---|---|---|
| Server state | **@tanstack/react-query** (queries + mutations) | ✅ New modules |
| UI state | **Zustand** (theme, sidebar, search, button) | ✅ New modules |
| Auth state | **React Context** (AuthContext) | ✅ New modules |
| Form validation | **Zod** schemas | ✅ New modules |
| HTTP client | **Axios** via `src/shared/lib/axios.ts` | ✅ New modules |
| Legacy (old pages) | Redux Toolkit + RTK Query | ⚠️ Still in use by old pages |

---

## Service layer (frontend — NEW modules)

### File location convention

```
src/modules/<module>/lib/
├── api/
│   ├── <module>-<domain>.api.ts    ← raw HTTP calls only
│   └── index.ts
├── queries/
│   ├── <module>-<domain>.queries.ts ← React Query hooks
│   └── index.ts
└── mutations/                       ← (if separate from queries)
    ├── <module>-<domain>.mutations.ts
    └── index.ts
```

### API functions (`lib/api/`)
- Raw async functions — no hooks, no UI logic, no React API
- Use `GET`, `POST`, `PUT`, `PATCH`, `DELETE` from `@/shared/lib/axios`
- Every function has explicit return type `Promise<T>` — never `Promise<any>`
- One file per domain concern (e.g. `invoice-list.api.ts`, `invoice-pdf.api.ts`)

```typescript
// ✅ Correct
export async function fetchCandidates(params?: Record<string, unknown>): Promise<CandidateListResponse> {
  return GET<CandidateListResponse>(`/${CANDIDATE_URL}`, params)
}

// ❌ Wrong — no hooks, no dispatch
export function useCandidateList() { ... } // belongs in queries/
```

### Query hooks (`lib/queries/`)
- Use `useQuery` from `@tanstack/react-query`
- Query keys follow pattern: `[entityName, ...params]`
- Mutation hooks use `useMutation` and invalidate related queries on success via `useQueryClient`

```typescript
export function useCandidateList(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: ['candidates', params],
    queryFn: () => candidateApi.fetchCandidates(params),
  })
}
```

### Mutation hooks
- Use `useMutation`
- `onSuccess` always invalidates relevant queries
- Use `useQueryClient` — never call `queryClient` from module scope

### Loading / Error states
- Queries return `isLoading`, `isError`, `error`, `data` — use these in components
- Mutations return `isPending`, `isError`, `error` — use these in forms/buttons
- Show Ant Design `message` or `notification` on mutation success/error (in the component, not the hook)

---

## Shared HTTP wrapper (`src/shared/lib/axios.ts`)
- Single Axios instance with base URL from `VITE_API_BASE_URL`
- Injects `Authorization: Bearer <token>` from `localStorage.getItem('token')`
- On 401/403: removes token and redirects to `/login`
- Exports typed helpers: `GET<T>`, `POST<T>`, `PUT<T>`, `PATCH<T>`, `DELETE<T>`
- All helpers throw `ApiError` on failure

---

## Auth pattern

- **Context-based**: `AuthContext` in `modules/auth/context/`, consumed via `useAuth()` from `shared/hooks/useAuth`
- Initialized from `localStorage` on mount
- `setCredentials(user)` persists to localStorage
- `logout()` clears localStorage and resets state
- Token flows to HTTP requests via the Axios interceptor (reads from localStorage directly)

---

## UI state (Zustand stores in `src/shared/store/`)
- `theme.store.ts` — dark/light mode, persisted to localStorage
- `sidebar.store.ts` — collapsed state
- `search.store.ts` — candidate search filters
- `button.store.ts` — header action button state

---

## Routing

- `createBrowserRouter` from `react-router` (declarative, no `loader`/`action`)
- Module routes defined as `RouteObject[]` arrays in each module's `routes/` dir
- Root router assembled in `src/routes/index.tsx` from module route arrays
- `ProtectedRoute` wrapper in `shared/components/` guards `/dashboard/*` routes
- `DashboardLayout` in `shared/components/` provides sidebar + header + `<Outlet />`
- All page components lazy-loaded with `Suspense`

---

## Service layer (backend — server/src/)
- Controllers call services / models — never put business logic in the route handler
- Route files define paths and attach middleware only

## Layer responsibility (backend — strictly enforced)

| Layer | Allowed | Forbidden |
|---|---|---|
| `routes` | Register paths, attach middleware | Any logic, DB access |
| `controllers` | Parse req, call model/service, send res | Business logic |
| `model` | Mongoose schema + model definitions | HTTP concerns |

## API response shape
- Success: `{ success: true, data: T }` (existing pattern)
- Error: `{ success: false, message: string }`
- Never return raw database models — always map to a response shape

## Error handling
- Global error handler middleware on server (already exists in server/src/legacy/index.js)
- 401 / 403 handled on frontend via Axios interceptor — redirect to login
- Never access `error.response` directly in components — use error from `useQuery`/`useMutation`
