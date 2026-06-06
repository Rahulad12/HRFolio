export type InterviewStatus = 'draft' | 'scheduled' | 'completed' | 'cancelled' | 'failed'
export type InterviewRound = 'first' | 'second' | 'third'
export type InterviewType = 'phone' | 'video' | 'in-person'

export interface Interviewer {
  _id: string
  name: string
  email: string
  department: string
  position: string
  createdAt: string
  updatedAt: string
}

export interface Interview {
  _id: string
  candidate: { _id: string; name: string; email: string; level?: string; technology?: string }
  interviewer: Interviewer
  date: string | null
  time: string | null
  type: InterviewType
  feedback: string
  rating: number
  notes: string
  status: InterviewStatus
  InterviewRound: InterviewRound
  meetingLink: string
  createdAt: string
  updatedAt: string
}

export interface InterviewListResponse {
  success: boolean
  message: string
  data?: Interview[]
}

export interface InterviewerListResponse {
  success: boolean
  message: string
  data: Interviewer[]
}

export interface CandidateBasic {
  _id: string
  name: string
  email: string
  technology: string
  level: string
  experience: number
  status: string
  progress: {
    assessment: { completed: boolean; date: string | null }
  }
}

export interface InterviewLog {
  _id: string
  interviewId: Interview
  candidate: { _id: string; name: string; email: string }
  interviewer: Interviewer
  action: string
  details: {
    date: string
    time: string
    type: InterviewType
    note: string
    status: InterviewStatus
    rating: number
    feedback: string
    interviewRound: InterviewRound
    [key: string]: unknown
  }
  performedAt: string
  createdAt: string
}

export interface InterviewLogListResponse {
  success: boolean
  message: string
  data: InterviewLog[]
}

export interface CandidateListResponse {
  success: boolean
  message: string
  data: CandidateBasic[]
}
