import { useQuery } from '@tanstack/react-query'
import * as dashboardApi from '../api/dashboard.api'

const DASHBOARD_KEYS = {
  candidates: ['dashboard', 'candidates'] as const,
  interviews: ['dashboard', 'interviews'] as const,
  offers: ['dashboard', 'offers'] as const,
  assignments: ['dashboard', 'assignments'] as const,
  activityLogs: ['dashboard', 'activityLogs'] as const,
}

export function useDashboardCandidates() {
  return useQuery({
    queryKey: DASHBOARD_KEYS.candidates,
    queryFn: dashboardApi.fetchCandidates,
  })
}

export function useDashboardInterviews() {
  return useQuery({
    queryKey: DASHBOARD_KEYS.interviews,
    queryFn: dashboardApi.fetchInterviews,
  })
}

export function useDashboardOffers() {
  return useQuery({
    queryKey: DASHBOARD_KEYS.offers,
    queryFn: dashboardApi.fetchOffers,
  })
}

export function useDashboardAssignments() {
  return useQuery({
    queryKey: DASHBOARD_KEYS.assignments,
    queryFn: dashboardApi.fetchAssignments,
  })
}

export function useDashboardActivityLogs() {
  return useQuery({
    queryKey: DASHBOARD_KEYS.activityLogs,
    queryFn: dashboardApi.fetchActivityLogs,
  })
}
