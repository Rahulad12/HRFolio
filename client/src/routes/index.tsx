import { createBrowserRouter, type RouteObject } from 'react-router'
import { lazy, Suspense } from 'react'
import { PageLoader } from '@/shared/components/PageLoader'
import { ProtectedRoute } from '@/shared/components/ProtectedRoute'
import { DashboardLayout } from '@/shared/components/DashboardLayout'
import { dashboardRoutes } from '@/modules/dashboard'
import { candidateRoutes } from '@/modules/candidates'
import { interviewRoutes } from '@/modules/interviews'
import { assessmentRoutes } from '@/modules/assessments'
import { offerRoutes } from '@/modules/offers'
import { emailRoutes } from '@/modules/emails'

const LandingPage = lazy(() => import('@/modules/landing/page').then((m) => ({ default: m.LandingPage })))
const LoginPage = lazy(() => import('@/modules/auth/page').then((m) => ({ default: m.LoginPage })))
const NotFound = lazy(() => import('../pages/NotFound').then((m) => ({ default: m.default })))

function lazyRoute(Component: React.LazyExoticComponent<React.ComponentType>) {
  return (
    <Suspense fallback={<PageLoader />}>
      <Component />
    </Suspense>
  )
}

const dashChildren: RouteObject[] = [
  ...dashboardRoutes,
  ...candidateRoutes,
  ...interviewRoutes,
  ...assessmentRoutes,
  ...offerRoutes,
  ...emailRoutes,
  { path: '*', element: lazyRoute(NotFound) },
]

export const router = createBrowserRouter([
  {
    path: '/',
    children: [
      { index: true, element: lazyRoute(LandingPage) },
      { path: 'login', element: lazyRoute(LoginPage) },
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <DashboardLayout />,
            children: dashChildren,
          },
        ],
      },
      { path: '*', element: lazyRoute(NotFound) },
    ],
  },
])
