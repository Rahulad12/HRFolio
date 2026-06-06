import { z } from 'zod'

export const interviewerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Enter a valid email'),
  department: z.string().min(1, 'Department is required'),
  position: z.string().min(1, 'Position is required'),
})

export type InterviewerFormValues = z.infer<typeof interviewerSchema>
