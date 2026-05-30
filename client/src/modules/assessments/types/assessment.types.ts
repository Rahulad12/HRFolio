export type AssessmentType = 'behavioural' | 'technical'

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
