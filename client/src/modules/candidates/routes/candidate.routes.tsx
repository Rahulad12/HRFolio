import { lazy } from 'react'

const LazyCandidateList = lazy(() => import('../page').then((m) => ({ default: m.CandidateListPage })))
const LazyCandidateDetail = lazy(() => import('../page').then((m) => ({ default: m.CandidateDetailPage })))
const LazyCandidateForm = lazy(() => import('../page').then((m) => ({ default: m.CandidateFormPage })))
const LazyCandidateSendEmail = lazy(() => import('../page').then((m) => ({ default: m.CandidateSendEmailPage })))

export const candidateRoutes = [
  { path: 'candidates', element: <LazyCandidateList /> },
  { path: 'candidates/new', element: <LazyCandidateForm /> },
  { path: 'candidates/edit/:id', element: <LazyCandidateForm /> },
  { path: 'candidates/email/:id', element: <LazyCandidateSendEmail /> },
  { path: 'candidates/:id', element: <LazyCandidateDetail /> },
]
