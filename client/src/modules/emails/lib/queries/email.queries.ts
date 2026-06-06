import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as emailApi from '../api/email.api'
import type { EmailTemplateFormData } from '../../types/email.types'

const EMAIL_TEMPLATES_KEY = ['email-templates'] as const

export function useEmailTemplateList(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: [...EMAIL_TEMPLATES_KEY, params],
    queryFn: () => emailApi.fetchEmailTemplates(params),
  })
}

export function useEmailTemplateById(id: string) {
  return useQuery({
    queryKey: [...EMAIL_TEMPLATES_KEY, id],
    queryFn: () => emailApi.fetchEmailTemplateById(id),
    enabled: !!id,
  })
}

export function useCreateEmailTemplate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: EmailTemplateFormData) => emailApi.createEmailTemplate(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: EMAIL_TEMPLATES_KEY }),
  })
}

export function useUpdateEmailTemplate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<EmailTemplateFormData> }) =>
      emailApi.updateEmailTemplate(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: EMAIL_TEMPLATES_KEY }),
  })
}

export function useDeleteEmailTemplate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => emailApi.deleteEmailTemplate(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: EMAIL_TEMPLATES_KEY }),
  })
}
