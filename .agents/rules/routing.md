# Routing

## Mode

Declarative mode using `createBrowserRouter`. No `loader` or `action` functions — React Query owns all data fetching.

## Root Router

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

## Module Route Files

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

## Protected Routes

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

## Lazy Loading

All page-level components must be lazy loaded. Heavy non-route components (charts, rich text editors, maps, data grids) must also be lazy loaded.

```ts
// Lazy load all pages
const InvoiceListPage = lazy(() => import('../pages/invoice-list'))
const InvoiceDetailPage = lazy(() => import('../pages/invoice-detail'))
```

### Suspense Boundaries

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

## URL State

Filters, pagination, search, and sort order all live in the URL via **nuqs**. See `url-state.md` for details.

## Navigation Links

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

### Dynamic Links

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

### Navigation Rules Summary

| Scenario | Use | Don't Use |
|---|---|---|
| Linking between routes | `<Link to="..." />` | `<a href="...">` |
| Programmatic navigation | `navigate('/path')` | `window.location.href` |
| External links | `<a href="https://...">` | `<Link>` (won't work) |
| Page reload needed | `window.location.reload()` | `navigate()` |
