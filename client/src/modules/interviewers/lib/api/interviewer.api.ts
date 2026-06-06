import { GET, POST, PUT, DELETE } from '@/shared/lib/axios'
import { INTERVIEWER_URL } from '@/shared/constants/api'
import type { InterviewerListResponse, InterviewerResponse, InterviewerFormData } from '../../types/interviewer.types'

export async function fetchInterviewers(params?: Record<string, unknown>): Promise<InterviewerListResponse> {
  return GET<InterviewerListResponse>(`/${INTERVIEWER_URL}`, params)
}

export async function fetchInterviewerById(id: string): Promise<InterviewerResponse> {
  return GET<InterviewerResponse>(`/${INTERVIEWER_URL}/${id}`)
}

export async function createInterviewer(data: InterviewerFormData): Promise<InterviewerResponse> {
  return POST<InterviewerResponse>(`/${INTERVIEWER_URL}`, data)
}

export async function updateInterviewer(id: string, data: Partial<InterviewerFormData>): Promise<InterviewerResponse> {
  return PUT<InterviewerResponse>(`/${INTERVIEWER_URL}/${id}`, data)
}

export async function deleteInterviewer(id: string): Promise<{ success: boolean; message: string }> {
  return DELETE<{ success: boolean; message: string }>(`/${INTERVIEWER_URL}/${id}`)
}
