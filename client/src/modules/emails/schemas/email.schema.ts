import { z } from 'zod'

export const emailTemplateSchema = z.object({
  name: z.string().min(1, 'Template name is required'),
  subject: z.string().min(1, 'Subject is required'),
  body: z.string().min(1, 'Body is required'),
  type: z.enum(['offer', 'interview', 'assessment', 'rejection', 'other'], {
    error: 'Type is required',
  }),
  variables: z.array(z.string()).default([]),
})

export type EmailTemplateFormValues = z.infer<typeof emailTemplateSchema>
