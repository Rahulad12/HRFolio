import { lazy, Suspense } from 'react'
import type { RouteObject } from 'react-router'
import { PageLoader } from '@/shared/components/PageLoader'

const LazyLookupValues = lazy(() =>
  import('../page').then(m => ({ default: m.LookupValuesPage }))
)

const LazyPermissions = lazy(() =>
  import('../permissions-page').then(m => ({ default: m.PermissionsPage }))
)

export const settingsRoutes: RouteObject[] = [
  { path: 'settings/lookup-values', element: <Suspense fallback={<PageLoader />}><LazyLookupValues /></Suspense> },
  { path: 'settings/permissions', element: <Suspense fallback={<PageLoader />}><LazyPermissions /></Suspense> },
]
