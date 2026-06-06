import { GET, POST, PUT, DELETE } from '@/shared/lib/axios'
import { ASSESSMENT_URL, CANDIDATE_URL, EMAIL_TEMPLATE_URL } from '@/shared/constants/api'
import type { AssessmentListResponse, AssessmentResponse, AssessmentFormData, AssignmentListResponse, AssignmentFormData, CandidateBasicListResponse, EmailTemplateListResponse, AssessmentLogListResponse } from '../../types/assessment.types'

export async function fetchAssessments(params?: Record<string, unknown>): Promise<AssessmentListResponse> {
  return GET<AssessmentListResponse>(`/${ASSESSMENT_URL}`, params)
}

export async function fetchAssessmentById(id: string): Promise<AssessmentResponse> {
  return GET<AssessmentResponse>(`/${ASSESSMENT_URL}/${id}`)
}

export async function createAssessment(data: AssessmentFormData): Promise<AssessmentResponse> {
  return POST<AssessmentResponse>(`/${ASSESSMENT_URL}`, data)
}

export async function updateAssessment(id: string, data: Partial<AssessmentFormData>): Promise<AssessmentResponse> {
  return PUT<AssessmentResponse>(`/${ASSESSMENT_URL}/${id}`, data)
}

export async function deleteAssessment(id: string): Promise<{ success: boolean; message: string }> {
  return DELETE<{ success: boolean; message: string }>(`/${ASSESSMENT_URL}/${id}`)
}

export async function fetchAssignments(params?: Record<string, unknown>): Promise<AssignmentListResponse> {
  return GET<AssignmentListResponse>(`/${ASSESSMENT_URL}/assignment`, params)
}

export async function createAssignment(data: AssignmentFormData): Promise<{ success: boolean; message: string }> {
  return POST<{ success: boolean; message: string }>(`/${ASSESSMENT_URL}/assign`, data)
}

export async function submitScore(data: Record<string, unknown>): Promise<{ success: boolean; message: string }> {
  return POST<{ success: boolean; message: string }>(`/${ASSESSMENT_URL}/score`, data)
}

export async function deleteAssignment(id: string): Promise<{ success: boolean; message: string }> {
  return DELETE<{ success: boolean; message: string }>(`/${ASSESSMENT_URL}/assignment/${id}`)
}

export async function fetchAssignCandidates(params?: Record<string, unknown>): Promise<CandidateBasicListResponse> {
  return GET<CandidateBasicListResponse>(`/${CANDIDATE_URL}`, params)
}

export async function fetchAssessmentLogsByCandidate(candidateId: string): Promise<AssessmentLogListResponse> {
  return GET<AssessmentLogListResponse>(`/${ASSESSMENT_URL}/logs/candidate/${candidateId}`)
}

export async function fetchEmailTemplates(params?: Record<string, unknown>): Promise<EmailTemplateListResponse> {
  return GET<EmailTemplateListResponse>(`/${EMAIL_TEMPLATE_URL}`, params)
}
