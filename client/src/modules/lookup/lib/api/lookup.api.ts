import { GET, POST, PUT, DELETE } from '@/shared/lib/axios'
import { LOOKUP_URL } from '@/shared/constants/api'
import type { LookupListResponse, LookupMutationResponse } from '../../types/lookup.types'

export const fetchInterviewRounds = () =>
  GET<LookupListResponse>(`/${LOOKUP_URL}/interview-rounds`)

export const fetchCandidateStatuses = () =>
  GET<LookupListResponse>(`/${LOOKUP_URL}/candidate-statuses`)

export const fetchInterviewTypes = () =>
  GET<LookupListResponse>(`/${LOOKUP_URL}/interview-types`)

export const fetchInterviewStatuses = () =>
  GET<LookupListResponse>(`/${LOOKUP_URL}/interview-statuses`)

export const createLookupValue = (endpoint: string, data: Record<string, unknown>) =>
  POST<LookupMutationResponse>(`/${LOOKUP_URL}/${endpoint}`, data)

export const updateLookupValue = (endpoint: string, id: string, data: Record<string, unknown>) =>
  PUT<LookupMutationResponse>(`/${LOOKUP_URL}/${endpoint}/${id}`, data)

export const deactivateLookupValue = (endpoint: string, id: string) =>
  DELETE<LookupMutationResponse>(`/${LOOKUP_URL}/${endpoint}/${id}`)
