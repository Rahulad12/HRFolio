import { z } from 'zod'

export const offerSchema = z.object({
  candidate: z.string().min(1, 'Candidate is required'),
  email: z.string().min(1, 'Email template is required'),
  position: z.string().min(1, 'Position is required'),
  salary: z.string().min(1, 'Salary is required'),
  startDate: z.string().min(1, 'Start date is required'),
  responseDeadline: z.string().min(1, 'Response deadline is required'),
  status: z.enum(['draft', 'sent']).default('draft'),
})

export type OfferFormValues = z.infer<typeof offerSchema>
