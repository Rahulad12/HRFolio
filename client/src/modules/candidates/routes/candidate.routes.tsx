import { lazy } from 'react'

const LazyCandidateList = lazy(() => import('../page').then((m) => ({ default: m.CandidateListPage })))
const LazyCandidateDetail = lazy(() => import('../page').then((m) => ({ default: m.CandidateDetailPage })))

export const candidateRoutes = [
  { path: 'candidates', element: <LazyCandidateList /> },
  { path: 'candidates/:id', element: <LazyCandidateDetail /> },
]
