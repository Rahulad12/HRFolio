export interface CandidateData {
  _id: string
  name: string
  email: string
  phone: string
  technology: string
  level: string
  status: string
  progress?: {
    hired?: { completed: boolean; date: string }
    [key: string]: { completed: boolean; date?: string } | undefined
  }
  createdAt: string
  updatedAt: string
}

export interface CandidateListResponse {
  success: boolean
  data: CandidateData[]
}

export interface InterviewData {
  _id: string
  candidate: { _id: string; name: string; level: string }
  interviewer: { _id: string; name: string }
  date: string
  time: string
  status: string
  InterviewRound: string
  createdAt: string
}

export interface InterviewListResponse {
  success: boolean
  data: InterviewData[]
}

export interface OfferData {
  _id: string
  candidate: { _id: string }
  status: string
  createdAt: string
}

export interface OfferListResponse {
  success: boolean
  data: OfferData[]
}

export interface AssignmentData {
  _id: string
  candidate: { _id: string }
  status: string
  createdAt: string
}

export interface AssignmentListResponse {
  success: boolean
  data: AssignmentData[]
}

export interface ActivityLog {
  _id: string
  entityType: string
  action: string
  metaData: {
    title: string
    description: string
    [key: string]: unknown
  }
  createdAt: string
}

export interface ActivityLogResponse {
  success: boolean
  data: ActivityLog[]
}
