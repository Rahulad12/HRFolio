export type CandidateStatus =
  | 'shortlisted'
  | 'assessment'
  | 'first'
  | 'second'
  | 'third'
  | 'offered'
  | 'hired'
  | 'rejected'

export interface Reference {
  _id: string
  name: string
  contact: string
  relation: string
}

export interface ProgressEntry {
  completed: boolean
  date: string | null
}

export interface CandidateProgress {
  shortlisted: ProgressEntry
  first: ProgressEntry
  second: ProgressEntry
  third: ProgressEntry
  assessment: ProgressEntry
  offered: ProgressEntry
  hired: ProgressEntry
  rejected: ProgressEntry
}

export interface Candidate {
  _id: string
  name: string
  email: string
  phone: string
  technology: string
  level: string
  experience: number
  expectedsalary: number
  references: Reference[]
  status: CandidateStatus
  createdAt: string
  applieddate: string
  resume: string
  updatedAt: string
  progress: CandidateProgress
}

export interface CandidateListResponse {
  success: boolean
  message: string
  data: Candidate[]
}

export interface CandidateResponse {
  success: boolean
  message: string
  data: Candidate
}

export interface CandidateFilter {
  searchText: string
  status: string
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

export interface CandidateFormData {
  name: string
  email: string
  phone: string
  technology: string
  level: string
  experience: number
  expectedsalary: number
  references: { name: string; contact: string; relation: string }[]
  applieddate: string | null
  resume: string | null
  status: CandidateStatus
  progress: CandidateProgress
}
