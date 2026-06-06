import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as interviewApi from '../api/interview.api'

const INTERVIEWS_KEY = ['interviews'] as const
const INTERVIEWERS_KEY = ['interviewers'] as const

export function useInterviewList(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: [...INTERVIEWS_KEY, params],
    queryFn: () => interviewApi.fetchInterviews(params),
  })
}

export function useInterviewById(id: string) {
  return useQuery({
    queryKey: [...INTERVIEWS_KEY, id],
    queryFn: () => interviewApi.fetchInterviewById(id),
    enabled: !!id,
  })
}

export function useCreateInterview() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => interviewApi.createInterview(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: INTERVIEWS_KEY }),
  })
}

export function useUpdateInterview() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      interviewApi.updateInterview(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: INTERVIEWS_KEY }),
  })
}

export function useInterviewerList(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: [...INTERVIEWERS_KEY, params],
    queryFn: () => interviewApi.fetchInterviewers(params),
  })
}

export function useCreateInterviewer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => interviewApi.createInterviewer(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: INTERVIEWERS_KEY }),
  })
}

export function useEligibleCandidates() {
  return useQuery({
    queryKey: [...INTERVIEWS_KEY, 'eligible-candidates'],
    queryFn: () => interviewApi.fetchEligibleCandidates(),
  })
}

export function useInterviewLogsByCandidate(candidateId: string) {
  return useQuery({
    queryKey: [...INTERVIEWS_KEY, 'logs', candidateId],
    queryFn: () => interviewApi.fetchInterviewLogsByCandidate(candidateId),
    enabled: !!candidateId,
  })
}

export function useDeleteInterview() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => interviewApi.deleteInterview(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: INTERVIEWS_KEY }),
  })
}
