import { lazy, Suspense } from 'react'
import type { RouteObject } from 'react-router'
import { PageLoader } from '@/shared/components/PageLoader'

const LazyLookupValues = lazy(() =>
  import('../page').then(m => ({ default: m.LookupValuesPage }))
)

export const settingsRoutes: RouteObject[] = [
  { path: 'settings/lookup-values', element: <Suspense fallback={<PageLoader />}><LazyLookupValues /></Suspense> },
]
