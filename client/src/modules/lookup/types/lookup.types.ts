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
