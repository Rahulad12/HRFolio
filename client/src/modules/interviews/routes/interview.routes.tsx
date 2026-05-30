import { lazy } from 'react'
import type { RouteObject } from 'react-router'

const LazyInterviewList = lazy(() => import('../page').then((m) => ({ default: m.InterviewListPage })))

export const interviewRoutes: RouteObject[] = [
  { path: 'interviews', element: <LazyInterviewList /> },
]
