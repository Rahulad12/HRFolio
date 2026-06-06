import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as interviewerApi from '../api/interviewer.api'
import type { InterviewerFormData } from '../../types/interviewer.types'

const INTERVIEWERS_KEY = ['interviewers'] as const

export function useInterviewerList(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: [...INTERVIEWERS_KEY, params],
    queryFn: () => interviewerApi.fetchInterviewers(params),
  })
}

export function useInterviewerById(id: string) {
  return useQuery({
    queryKey: [...INTERVIEWERS_KEY, id],
    queryFn: () => interviewerApi.fetchInterviewerById(id),
    enabled: !!id,
  })
}

export function useCreateInterviewer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: InterviewerFormData) => interviewerApi.createInterviewer(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: INTERVIEWERS_KEY }),
  })
}

export function useUpdateInterviewer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<InterviewerFormData> }) =>
      interviewerApi.updateInterviewer(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: INTERVIEWERS_KEY }),
  })
}

export function useDeleteInterviewer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => interviewerApi.deleteInterviewer(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: INTERVIEWERS_KEY }),
  })
}
