import { GET, POST, PUT, DELETE } from '@/shared/lib/axios'
import { CANDIDATE_URL } from '@/shared/constants/api'
import type { CandidateListResponse, CandidateResponse, CandidateFormData } from '../../types/candidate.types'

export async function fetchCandidates(params?: Record<string, unknown>): Promise<CandidateListResponse> {
  return GET<CandidateListResponse>(`/${CANDIDATE_URL}`, params)
}

export async function fetchCandidateById(id: string): Promise<CandidateResponse> {
  return GET<CandidateResponse>(`/${CANDIDATE_URL}/${id}`)
}

export async function createCandidate(data: CandidateFormData): Promise<CandidateResponse> {
  return POST<CandidateResponse>(`/${CANDIDATE_URL}`, data)
}

export async function updateCandidate(id: string, data: Partial<CandidateFormData>): Promise<CandidateResponse> {
  return PUT<CandidateResponse>(`/${CANDIDATE_URL}/${id}`, data)
}

export async function deleteCandidate(id: string): Promise<{ success: boolean; message: string }> {
  return DELETE<{ success: boolean; message: string }>(`/${CANDIDATE_URL}/${id}`)
}

export async function updateCandidateStatus(id: string, status: string): Promise<CandidateResponse> {
  return PUT<CandidateResponse>(`/${CANDIDATE_URL}/${id}/status`, { status })
}

export async function uploadResume(file: FormData): Promise<{ success: boolean; message: string; url: string }> {
  return POST<{ success: boolean; message: string; url: string }>('/upload', file)
}
