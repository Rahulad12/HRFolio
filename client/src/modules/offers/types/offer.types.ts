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

export interface CandidateBasic {
  _id: string
  name: string
  email: string
}

export interface EmailTemplate {
  _id: string
  name: string
  type: string
  body: string
}

export interface OfferLog {
  _id: string
  candidate: { _id: string; name: string; email: string }
  offer: Offer
  action: string
  details: {
    status: string
    salary?: string
    responseDeadline?: string
    [key: string]: unknown
  }
  performedAt: string
  createdAt: string
}

export interface OfferLogListResponse {
  success: boolean
  message: string
  data: OfferLog[]
}

export interface CandidateListResponse {
  success: boolean
  message: string
  data: CandidateBasic[]
}

export interface EmailTemplateListResponse {
  success: boolean
  message: string
  data: EmailTemplate[]
}
