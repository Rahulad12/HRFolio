import { lazy } from 'react'
import type { RouteObject } from 'react-router'

const LazyDashboard = lazy(() => import('../page').then((m) => ({ default: m.DashboardPage })))

export const dashboardRoutes: RouteObject[] = [
  { index: true, element: <LazyDashboard /> },
]
