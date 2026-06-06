import { lazy } from 'react'

const LazyInterviewerList = lazy(() => import('../page').then((m) => ({ default: m.InterviewerListPage })))
const LazyInterviewerForm = lazy(() => import('../page').then((m) => ({ default: m.InterviewerFormPage })))

export const interviewerRoutes = [
  { path: 'interviewers', element: <LazyInterviewerList /> },
  { path: 'interviewers/new', element: <LazyInterviewerForm /> },
  { path: 'interviewers/edit/:id', element: <LazyInterviewerForm /> },
]
