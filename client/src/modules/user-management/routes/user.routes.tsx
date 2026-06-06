import { lazy } from 'react'
import type { RouteObject } from 'react-router'

const LazyUserManagement = lazy(() => import('../page').then((m) => ({ default: m.UserManagementPage })))

export const userManagementRoutes: RouteObject[] = [
  { path: 'user-management', element: <LazyUserManagement /> },
]
