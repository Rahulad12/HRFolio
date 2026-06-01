export type EmailTemplateType = 'offer' | 'interview' | 'assessment' | 'rejection' | 'hired' | 'other'

export interface EmailTemplate {
  _id: string
  name: string
  subject: string
  body: string
  type: EmailTemplateType
  variables: string[]
  createdAt: string
  updatedAt: string
}

export interface EmailTemplateListResponse {
  success: boolean
  message: string
  data: EmailTemplate[]
}

export interface EmailTemplateResponse {
  success: boolean
  message: string
  data: EmailTemplate
}

export interface EmailTemplateFormData {
  name: string
  subject: string
  body: string
  type: EmailTemplateType
  variables: string[]
}
