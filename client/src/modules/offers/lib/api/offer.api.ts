import { GET, POST, PUT } from '@/shared/lib/axios'
import { OFFER_URL } from '@/shared/constants/api'
import type { OfferListResponse, OfferResponse, OfferFormData } from '../../types/offer.types'

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

export async function sendOffer(id: string): Promise<OfferResponse> {
  return POST<OfferResponse>(`/${OFFER_URL}/${id}/send`)
}
