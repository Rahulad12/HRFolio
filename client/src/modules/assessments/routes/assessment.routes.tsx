import { lazy } from 'react'
import type { RouteObject } from 'react-router'

const LazyAssessmentList = lazy(() => import('../page').then((m) => ({ default: m.AssessmentListPage })))
const LazyAssignmentList = lazy(() => import('../page').then((m) => ({ default: m.AssignmentListPage })))

export const assessmentRoutes: RouteObject[] = [
  { path: 'assessments', element: <LazyAssessmentList /> },
  { path: 'assessments/assignments', element: <LazyAssignmentList /> },
]
