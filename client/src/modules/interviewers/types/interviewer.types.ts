export interface Interviewer {
  _id: string
  name: string
  email: string
  department: string
  position: string
}

export interface InterviewerListResponse {
  success: boolean
  message: string
  data: Interviewer[]
}

export interface InterviewerResponse {
  success: boolean
  message: string
  data: Interviewer
}

export interface InterviewerFormData {
  name: string
  email: string
  department: string
  position: string
}
