import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as assessmentApi from '../api/assessment.api'
import type { AssessmentFormData, AssignmentFormData } from '../../types/assessment.types'

const ASSESSMENTS_KEY = ['assessments'] as const
const ASSIGNMENTS_KEY = ['assignments'] as const
const CANDIDATES_KEY = ['candidates'] as const
const EMAIL_TEMPLATES_KEY = ['emailTemplates'] as const

export function useAssessmentList(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: [...ASSESSMENTS_KEY, params],
    queryFn: () => assessmentApi.fetchAssessments(params),
  })
}

export function useAssessmentById(id: string) {
  return useQuery({
    queryKey: [...ASSESSMENTS_KEY, id],
    queryFn: () => assessmentApi.fetchAssessmentById(id),
    enabled: !!id,
  })
}

export function useCreateAssessment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: AssessmentFormData) => assessmentApi.createAssessment(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ASSESSMENTS_KEY }),
  })
}

export function useUpdateAssessment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AssessmentFormData> }) =>
      assessmentApi.updateAssessment(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ASSESSMENTS_KEY }),
  })
}

export function useDeleteAssessment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => assessmentApi.deleteAssessment(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ASSESSMENTS_KEY }),
  })
}

export function useAssignmentList(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: [...ASSIGNMENTS_KEY, params],
    queryFn: () => assessmentApi.fetchAssignments(params),
  })
}

export function useCreateAssignment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: AssignmentFormData) => assessmentApi.createAssignment(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ASSIGNMENTS_KEY }),
  })
}

export function useDeleteAssignment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => assessmentApi.deleteAssignment(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ASSIGNMENTS_KEY }),
  })
}

export function useSubmitScore() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => assessmentApi.submitScore(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ASSIGNMENTS_KEY }),
  })
}

export function useCandidateBasicList(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: [...CANDIDATES_KEY, params],
    queryFn: () => assessmentApi.fetchAssignCandidates(params),
  })
}

export function useAssessmentLogsByCandidate(candidateId: string) {
  return useQuery({
    queryKey: [...ASSESSMENTS_KEY, 'logs', candidateId],
    queryFn: () => assessmentApi.fetchAssessmentLogsByCandidate(candidateId),
    enabled: !!candidateId,
  })
}

export function useEmailTemplateList(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: [...EMAIL_TEMPLATES_KEY, params],
    queryFn: () => assessmentApi.fetchEmailTemplates(params),
  })
}
