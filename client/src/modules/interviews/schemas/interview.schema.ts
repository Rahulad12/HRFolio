import { z } from 'zod'

export const interviewSchema = z.object({
  candidate: z.string().min(1, 'Candidate is required'),
  InterviewRound: z.string().min(1, 'Interview round is required'),
  interviewer: z.string().min(1, 'Interviewer is required'),
  date: z.any(),
  time: z.any(),
  type: z.string().min(1, 'Interview type is required'),
  meetingLink: z.string().url('Enter a valid URL').optional().or(z.literal('')),
  notes: z.string().optional(),
})

export type InterviewFormValues = z.infer<typeof interviewSchema>
