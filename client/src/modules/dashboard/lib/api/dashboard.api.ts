import { GET } from '@/shared/lib/axios'
import { CANDIDATE_URL, INTERVIEW_URL, OFFER_URL, ASSESSMENT_URL, ACTIVITY_LOG_URL } from '@/shared/constants/api'
import type { CandidateListResponse } from '../../types/dashboard.types'
import type { InterviewListResponse } from '../../types/dashboard.types'
import type { OfferListResponse } from '../../types/dashboard.types'
import type { AssignmentListResponse } from '../../types/dashboard.types'
import type { ActivityLogResponse } from '../../types/dashboard.types'

export function fetchCandidates(): Promise<CandidateListResponse> {
  return GET<CandidateListResponse>(`/${CANDIDATE_URL}`)
}

export function fetchInterviews(): Promise<InterviewListResponse> {
  return GET<InterviewListResponse>(`/${INTERVIEW_URL}`)
}

export function fetchOffers(): Promise<OfferListResponse> {
  return GET<OfferListResponse>(`/${OFFER_URL}`)
}

export function fetchAssignments(): Promise<AssignmentListResponse> {
  return GET<AssignmentListResponse>(`/${ASSESSMENT_URL}/assignment`)
}

export function fetchActivityLogs(): Promise<ActivityLogResponse> {
  return GET<ActivityLogResponse>(`/${ACTIVITY_LOG_URL}`)
}
