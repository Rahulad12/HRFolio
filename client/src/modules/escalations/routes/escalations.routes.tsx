import { lazy, Suspense } from 'react';
import { PageLoader } from '@/shared/components/PageLoader';

const LazEscalationsPage = lazy(() =>
  import('../page').then((m) => ({ default: m.EscalationsPage }))
);

export const escalationRoutes = [
  {
    path: 'escalations',
    element: (
      <Suspense fallback={<PageLoader />}>
        <LazEscalationsPage />
      </Suspense>
    ),
  },
];

export default escalationRoutes;
