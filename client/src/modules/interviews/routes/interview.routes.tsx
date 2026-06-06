import { lazy } from 'react'

const LazyInterviewList = lazy(() => import('../page').then((m) => ({ default: m.InterviewListPage })))
const LazyInterviewSchedule = lazy(() => import('../page').then((m) => ({ default: m.InterviewSchedulePage })))

export const interviewRoutes = [
  { path: 'interviews', element: <LazyInterviewList /> },
  { path: 'interviews/schedule', element: <LazyInterviewSchedule /> },
]
