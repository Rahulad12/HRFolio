import { z } from 'zod'

export const assessmentSchema = z.object({
  title: z.string().min(1, 'Assessment name is required'),
  type: z.enum(['behavioural', 'technical']),
  technology: z.string().min(1, 'Technology is required'),
  level: z.string().min(1, 'Level is required'),
  assessmentLink: z.string().url('Enter a valid URL'),
  duration: z.number().min(1, 'Duration is required'),
})

export type AssessmentFormValues = z.infer<typeof assessmentSchema>
