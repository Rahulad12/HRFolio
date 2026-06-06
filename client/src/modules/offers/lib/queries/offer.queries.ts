import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as offerApi from '../api/offer.api'
import type { OfferFormData } from '../../types/offer.types'

const OFFERS_KEY = ['offers'] as const
const CANDIDATES_KEY = ['offerCandidates'] as const
const EMAIL_TEMPLATES_KEY = ['offerEmailTemplates'] as const

export function useOfferList(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: [...OFFERS_KEY, params],
    queryFn: () => offerApi.fetchOffers(params),
  })
}

export function useOfferById(id: string) {
  return useQuery({
    queryKey: [...OFFERS_KEY, id],
    queryFn: () => offerApi.fetchOfferById(id),
    enabled: !!id,
  })
}

export function useCreateOffer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: OfferFormData) => offerApi.createOffer(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: OFFERS_KEY }),
  })
}

export function useUpdateOffer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<OfferFormData> }) =>
      offerApi.updateOffer(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: OFFERS_KEY }),
  })
}

export function useDeleteOffer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => offerApi.deleteOffer(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: OFFERS_KEY }),
  })
}

export function useSendOffer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => offerApi.sendOffer(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: OFFERS_KEY }),
  })
}

export function useOfferCandidates(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: [...CANDIDATES_KEY, params],
    queryFn: () => offerApi.fetchOfferCandidates(params),
  })
}

export function useOfferLogsByCandidate(candidateId: string) {
  return useQuery({
    queryKey: [...OFFERS_KEY, 'logs', candidateId],
    queryFn: () => offerApi.fetchOfferLogsByCandidate(candidateId),
    enabled: !!candidateId,
  })
}

export function useOfferEmailTemplates(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: [...EMAIL_TEMPLATES_KEY, params],
    queryFn: () => offerApi.fetchOfferEmailTemplates(params),
  })
}
