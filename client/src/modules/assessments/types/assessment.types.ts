export type AssessmentType = 'mcq' | 'coding' | 'assignment' | 'quiz'

export interface Assessment {
  _id: string
  title: string
  type: AssessmentType
  technology: string
  level: string
  assessmentLink: string
  duration: number
  createdAt: string
  updatedAt: string
}

export interface AssessmentListResponse {
  success: boolean
  message: string
  data: Assessment[]
}

export interface AssessmentResponse {
  success: boolean
  message: string
  data: Assessment
}

export interface Assignment {
  _id: string
  candidate: { _id: string; name: string; email: string }
  assessment: Assessment
  date: string
  status: 'assigned' | 'pending' | 'completed'
  score: number
  emailTemplate: string
  createdAt: string
  updatedAt: string
}

export interface AssignmentListResponse {
  success: boolean
  message: string
  data: Assignment[]
}

export interface AssessmentFormData {
  title: string
  type: AssessmentType
  technology: string
  level: string
  assessmentLink: string
  duration: number
}

export interface AssignmentFormData {
  candidate: string[]
  assessment: string
  dueDate: string
  emailTemplate: string
}

export interface AssignmentScoreFormData {
  score: number
  note: string
  candidate: string
  assessment: string
}

export interface EmailTemplate {
  _id: string
  name: string
  type: string
  body: string
}

export interface EmailTemplateListResponse {
  success: boolean
  message: string
  data: EmailTemplate[]
}

export interface CandidateBasic {
  _id: string
  name: string
  email: string
  technology: string
  level: string
}

export interface CandidateBasicListResponse {
  success: boolean
  message: string
  data: CandidateBasic[]
}
