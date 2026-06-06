import { lazy } from 'react'
import type { RouteObject } from 'react-router'

const LazyEmailList = lazy(() => import('../page').then((m) => ({ default: m.EmailTemplateListPage })))
const LazyEmailForm = lazy(() => import('../page').then((m) => ({ default: m.EmailTemplateFormPage })))

export const emailRoutes: RouteObject[] = [
  { path: 'email-templates', element: <LazyEmailList /> },
  { path: 'email-templates/new', element: <LazyEmailForm /> },
  { path: 'email-templates/edit/:id', element: <LazyEmailForm /> },
]
