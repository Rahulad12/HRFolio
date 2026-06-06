import { lazy } from 'react'
import type { RouteObject } from 'react-router'

const LazyOfferList = lazy(() => import('../page').then((m) => ({ default: m.OfferListPage })))
const LazyOfferForm = lazy(() => import('../page').then((m) => ({ default: m.OfferFormPage })))

export const offerRoutes: RouteObject[] = [
  { path: 'offers', element: <LazyOfferList /> },
  { path: 'offers/new', element: <LazyOfferForm /> },
  { path: 'offers/edit/:id', element: <LazyOfferForm /> },
]
