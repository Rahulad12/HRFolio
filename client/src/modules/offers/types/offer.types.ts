export type OfferStatus = 'draft' | 'sent' | 'accepted' | 'rejected'

export interface Offer {
  _id: string
  candidate: { _id: string; name: string; email: string }
  email: string
  position: string
  salary: string
  startDate: string
  responseDeadline: string
  status: OfferStatus
  createdAt: string
  updatedAt: string
}

export interface OfferListResponse {
  success: boolean
  message: string
  data: Offer[]
}

export interface OfferResponse {
  success: boolean
  message: string
  data: Offer
}

export interface OfferFormData {
  candidate: string
  email: string
  position: string
  salary: string
  startDate: string
  responseDeadline: string
  status: OfferStatus
}
