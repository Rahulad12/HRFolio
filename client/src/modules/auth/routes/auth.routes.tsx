import { lazy } from 'react'

const LazyLoginPage = lazy(() =>
  import('../page').then((m) => ({ default: m.LoginPage })),
)

export const authRoutes = [
  {
    path: 'login',
    element: <LazyLoginPage />,
  },
]
