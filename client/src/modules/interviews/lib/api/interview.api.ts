import { GET, POST, PUT, DELETE } from '@/shared/lib/axios'
import { INTERVIEW_URL, INTERVIEWER_URL, CANDIDATE_URL } from '@/shared/constants/api'
import type { InterviewListResponse, InterviewerListResponse, CandidateListResponse, InterviewLogListResponse } from '../../types/interview.types'

export async function fetchInterviews(params?: Record<string, unknown>): Promise<InterviewListResponse> {
  return GET<InterviewListResponse>(`/${INTERVIEW_URL}`, params)
}

export async function fetchInterviewById(id: string): Promise<InterviewListResponse> {
  return GET<InterviewListResponse>(`/${INTERVIEW_URL}/${id}`)
}

export async function createInterview(data: Record<string, unknown>): Promise<InterviewListResponse> {
  return POST<InterviewListResponse>(`/${INTERVIEW_URL}`, data)
}

export async function updateInterview(id: string, data: Record<string, unknown>): Promise<InterviewListResponse> {
  return PUT<InterviewListResponse>(`/${INTERVIEW_URL}/${id}`, data)
}

export async function fetchInterviewers(params?: Record<string, unknown>): Promise<InterviewerListResponse> {
  return GET<InterviewerListResponse>(`/${INTERVIEWER_URL}`, params)
}

export async function createInterviewer(data: Record<string, unknown>): Promise<InterviewerListResponse> {
  return POST<InterviewerListResponse>(`/${INTERVIEWER_URL}`, data)
}

export async function deleteInterview(id: string): Promise<{ success: boolean; message: string }> {
  return DELETE<{ success: boolean; message: string }>(`/${INTERVIEW_URL}/${id}`)
}

export async function fetchInterviewLogsByCandidate(candidateId: string): Promise<InterviewLogListResponse> {
  return GET<InterviewLogListResponse>(`/${INTERVIEW_URL}/log/candidate/${candidateId}`)
}

export async function fetchEligibleCandidates(params?: Record<string, unknown>): Promise<CandidateListResponse> {
  return GET<CandidateListResponse>(`/${CANDIDATE_URL}`, params)
}
