import { lazy, Suspense } from 'react'
import { PageLoader } from '@/shared/components/PageLoader'
import type { RouteObject } from 'react-router'

const AuditLogListPage = lazy(() => import('../page').then((m) => ({ default: m.AuditLogListPage })))

export const auditLogRoutes: RouteObject[] = [
  {
    path: 'audit-logs',
    element: (
      <Suspense fallback={<PageLoader />}>
        <AuditLogListPage />
      </Suspense>
    ),
  },
]
