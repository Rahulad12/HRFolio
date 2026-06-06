import { GET, POST, PUT, DELETE } from '@/shared/lib/axios'
import { EMAIL_TEMPLATE_URL } from '@/shared/constants/api'
import type { EmailTemplateListResponse, EmailTemplateResponse, EmailTemplateFormData } from '../../types/email.types'

export async function fetchEmailTemplates(params?: Record<string, unknown>): Promise<EmailTemplateListResponse> {
  return GET<EmailTemplateListResponse>(`/${EMAIL_TEMPLATE_URL}`, params)
}

export async function fetchEmailTemplateById(id: string): Promise<EmailTemplateResponse> {
  return GET<EmailTemplateResponse>(`/${EMAIL_TEMPLATE_URL}/${id}`)
}

export async function createEmailTemplate(data: EmailTemplateFormData): Promise<EmailTemplateResponse> {
  return POST<EmailTemplateResponse>(`/${EMAIL_TEMPLATE_URL}`, data)
}

export async function updateEmailTemplate(id: string, data: Partial<EmailTemplateFormData>): Promise<EmailTemplateResponse> {
  return PUT<EmailTemplateResponse>(`/${EMAIL_TEMPLATE_URL}/${id}`, data)
}

export async function deleteEmailTemplate(id: string): Promise<{ success: boolean; message: string }> {
  return DELETE<{ success: boolean; message: string }>(`/${EMAIL_TEMPLATE_URL}/${id}`)
}
