import { lazy } from 'react'
import type { RouteObject } from 'react-router'

const LazyOfferList = lazy(() => import('../page').then((m) => ({ default: m.OfferListPage })))

export const offerRoutes: RouteObject[] = [
  { path: 'offers', element: <LazyOfferList /> },
]
