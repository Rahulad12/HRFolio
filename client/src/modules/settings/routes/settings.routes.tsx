import { lazy } from 'react'
import type { RouteObject } from 'react-router'

const LazyLookupValues = lazy(() =>
  import('../page').then(m => ({ default: m.LookupValuesPage }))
)

export const settingsRoutes: RouteObject[] = [
  { path: 'settings/lookup-values', element: <LazyLookupValues /> },
]
