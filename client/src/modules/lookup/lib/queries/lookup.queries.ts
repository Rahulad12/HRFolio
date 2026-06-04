import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as lookupApi from '../api/lookup.api'
import type { LookupValue, CreateLookupPayload, UpdateLookupPayload, LookupEndpoint } from '../../types/lookup.types'

export const LOOKUP_KEYS = {
  interviewRounds: ['lookup', 'interview-rounds'] as const,
  candidateStatuses: ['lookup', 'candidate-statuses'] as const,
  interviewTypes: ['lookup', 'interview-types'] as const,
  interviewStatuses: ['lookup', 'interview-statuses'] as const,
}

export function useInterviewRounds() {
  return useQuery({
    queryKey: LOOKUP_KEYS.interviewRounds,
    queryFn: () => lookupApi.fetchInterviewRounds(),
    staleTime: Infinity,
    gcTime: Infinity,
    select: (res) => res.data,
  })
}

export function useCandidateStatuses() {
  return useQuery({
    queryKey: LOOKUP_KEYS.candidateStatuses,
    queryFn: () => lookupApi.fetchCandidateStatuses(),
    staleTime: Infinity,
    gcTime: Infinity,
    select: (res) => res.data,
  })
}

export function useInterviewTypes() {
  return useQuery({
    queryKey: LOOKUP_KEYS.interviewTypes,
    queryFn: () => lookupApi.fetchInterviewTypes(),
    staleTime: Infinity,
    gcTime: Infinity,
    select: (res) => res.data,
  })
}

export function useInterviewStatuses() {
  return useQuery({
    queryKey: LOOKUP_KEYS.interviewStatuses,
    queryFn: () => lookupApi.fetchInterviewStatuses(),
    staleTime: Infinity,
    gcTime: Infinity,
    select: (res) => res.data,
  })
}

export function useCreateLookupValue(endpoint: LookupEndpoint, queryKey: readonly string[]) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateLookupPayload) => lookupApi.createLookupValue(endpoint, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  })
}

export function useUpdateLookupValue(endpoint: LookupEndpoint, queryKey: readonly string[]) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateLookupPayload }) =>
      lookupApi.updateLookupValue(endpoint, id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  })
}

export function useDeactivateLookupValue(endpoint: LookupEndpoint, queryKey: readonly string[]) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => lookupApi.deactivateLookupValue(endpoint, id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  })
}
