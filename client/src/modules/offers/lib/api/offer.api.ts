import { GET, POST, PUT, DELETE } from '@/shared/lib/axios'
import { OFFER_URL, CANDIDATE_URL, EMAIL_TEMPLATE_URL } from '@/shared/constants/api'
import type { OfferListResponse, OfferResponse, OfferFormData, CandidateListResponse, EmailTemplateListResponse, OfferLogListResponse } from '../../types/offer.types'

export async function fetchOffers(params?: Record<string, unknown>): Promise<OfferListResponse> {
  return GET<OfferListResponse>(`/${OFFER_URL}`, params)
}

export async function fetchOfferById(id: string): Promise<OfferResponse> {
  return GET<OfferResponse>(`/${OFFER_URL}/${id}`)
}

export async function createOffer(data: OfferFormData): Promise<OfferResponse> {
  return POST<OfferResponse>(`/${OFFER_URL}`, data)
}

export async function updateOffer(id: string, data: Partial<OfferFormData>): Promise<OfferResponse> {
  return PUT<OfferResponse>(`/${OFFER_URL}/${id}`, data)
}

export async function deleteOffer(id: string): Promise<{ success: boolean; message: string }> {
  return DELETE<{ success: boolean; message: string }>(`/${OFFER_URL}/${id}`)
}

export async function sendOffer(id: string): Promise<OfferResponse> {
  return POST<OfferResponse>(`/${OFFER_URL}/${id}/send`)
}

export async function fetchOfferCandidates(params?: Record<string, unknown>): Promise<CandidateListResponse> {
  return GET<CandidateListResponse>(`/${CANDIDATE_URL}`, params)
}

export async function fetchOfferLogsByCandidate(candidateId: string): Promise<OfferLogListResponse> {
  return GET<OfferLogListResponse>(`/${OFFER_URL}/log/candidate/${candidateId}`)
}

export async function fetchOfferEmailTemplates(params?: Record<string, unknown>): Promise<EmailTemplateListResponse> {
  return GET<EmailTemplateListResponse>(`/${EMAIL_TEMPLATE_URL}`, params)
}
