import { lazy } from 'react'
import type { RouteObject } from 'react-router'

const LazyEmailList = lazy(() => import('../page').then((m) => ({ default: m.EmailTemplateListPage })))

export const emailRoutes: RouteObject[] = [
  { path: 'email-templates', element: <LazyEmailList /> },
]
