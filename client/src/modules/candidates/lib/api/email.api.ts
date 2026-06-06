import { POST } from '@/shared/lib/axios'

export interface SendEmailPayload {
  candidate: string
  emailAddress: string
  subject: string
  body: string
}

export interface SendEmailResponse {
  success: boolean
  message: string
}

export async function sendGeneralEmail(data: SendEmailPayload): Promise<SendEmailResponse> {
  return POST<SendEmailResponse>('/email/general/send', data)
}
