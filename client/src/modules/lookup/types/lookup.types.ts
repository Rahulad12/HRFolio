export interface LookupValue {
  _id: string
  systemName: string
  displayName: string
  order: number
  color?: string
  isActive: boolean
}

export interface LookupListResponse {
  success: boolean
  data: LookupValue[]
}

export interface LookupMutationResponse {
  success: boolean
  message: string
  data?: LookupValue
}

export interface CreateLookupPayload {
  systemName: string
  displayName: string
  order: number
  color?: string
}

export type UpdateLookupPayload = {
  displayName?: string
  order?: number
  color?: string
}

export type LookupEndpoint = 'interview-rounds' | 'candidate-statuses' | 'interview-types' | 'interview-statuses'
