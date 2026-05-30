import { lazy } from 'react'
import type { RouteObject } from 'react-router'

const LazyLanding = lazy(() => import('../page').then((m) => ({ default: m.LandingPage })))

export const landingRoutes: RouteObject[] = [
  { index: true, element: <LazyLanding /> },
]
