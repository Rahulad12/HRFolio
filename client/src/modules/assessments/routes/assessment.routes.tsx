import { lazy } from 'react'
import type { RouteObject } from 'react-router'

const LazyAssessmentList = lazy(() => import('../page').then((m) => ({ default: m.AssessmentListPage })))
const LazyAssessmentForm = lazy(() => import('../page').then((m) => ({ default: m.AssessmentFormPage })))
const LazyAssignmentList = lazy(() => import('../page').then((m) => ({ default: m.AssignmentListPage })))
const LazyAssignAssessment = lazy(() => import('../page').then((m) => ({ default: m.AssignAssessmentPage })))

export const assessmentRoutes: RouteObject[] = [
  { path: 'assessments', element: <LazyAssessmentList /> },
  { path: 'assessments/new', element: <LazyAssessmentForm /> },
  { path: 'assessments/edit/:id', element: <LazyAssessmentForm /> },
  { path: 'assessments/assignments', element: <LazyAssignmentList /> },
  { path: 'assessments/assign', element: <LazyAssignAssessment /> },
]
