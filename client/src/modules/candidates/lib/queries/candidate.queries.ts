import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as candidateApi from '../api/candidate.api'
import type { CandidateFormData } from '../../types/candidate.types'

const CANDIDATES_KEY = ['candidates'] as const

export function useCandidateList(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: [...CANDIDATES_KEY, params],
    queryFn: () => candidateApi.fetchCandidates(params),
  })
}

export function useCandidateById(id: string) {
  return useQuery({
    queryKey: [...CANDIDATES_KEY, id],
    queryFn: () => candidateApi.fetchCandidateById(id),
    enabled: !!id,
  })
}

export function useCreateCandidate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CandidateFormData) => candidateApi.createCandidate(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CANDIDATES_KEY }),
  })
}

export function useUpdateCandidate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CandidateFormData> }) =>
      candidateApi.updateCandidate(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CANDIDATES_KEY }),
  })
}

export function useDeleteCandidate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => candidateApi.deleteCandidate(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CANDIDATES_KEY }),
  })
}

export function useUpdateCandidateStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      candidateApi.updateCandidateStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CANDIDATES_KEY }),
  })
}

export function useCandidateActivityLogs(candidateId: string) {
  return useQuery({
    queryKey: [...CANDIDATES_KEY, 'activityLogs', candidateId],
    queryFn: () => candidateApi.fetchCandidateActivityLogs(candidateId),
    enabled: !!candidateId,
  })
}

export function useUploadResume() {
  return useMutation({
    mutationFn: (file: FormData) => candidateApi.uploadResume(file),
  })
}
