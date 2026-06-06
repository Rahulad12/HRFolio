import { PublicRoutesLoader } from '@/shared/loaders/public-routes-loader'
import { lazy } from 'react'

const LazyLoginPage = lazy(() =>
  import('../page').then((m) => ({ default: m.LoginPage })),
)

export const authRoutes = [
  {
    path: 'login',
    loader: PublicRoutesLoader,
    element: <LazyLoginPage />,
  },
]
