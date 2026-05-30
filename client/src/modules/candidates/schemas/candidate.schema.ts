import { z } from 'zod'

export const candidateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(1, 'Phone is required'),
  technology: z.string().min(1, 'Technology is required'),
  level: z.string().min(1, 'Level is required'),
  experience: z.number().min(0, 'Experience must be >= 0'),
  expectedsalary: z.number().min(0, 'Salary must be >= 0'),
  applieddate: z.string().nullable().optional(),
  resume: z.string().nullable().optional(),
})

export type CandidateFormValues = z.infer<typeof candidateSchema>
