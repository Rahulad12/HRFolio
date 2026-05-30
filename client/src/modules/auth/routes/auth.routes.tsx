import { lazy } from 'react'

export const authRoutes = [
  {
    path: 'login',
    element: <LazyLoginPage />,
  },
]

const LazyLoginPage = lazy(() =>
  import('../page').then((m) => ({ default: m.LoginPage })),
)
