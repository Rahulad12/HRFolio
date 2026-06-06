import { z } from 'zod';

export const raiseEscalationSchema = z.object({
  candidateId: z
    .string()
    .min(1, 'Candidate is required')
    .describe('Candidate ID'),
  targetUserId: z
    .string()
    .min(1, 'HR Admin is required')
    .describe('HR Admin to escalate to'),
  notes: z
    .string()
    .min(5, 'Notes must be at least 5 characters')
    .max(500, 'Notes cannot exceed 500 characters')
    .describe('Escalation notes'),
});

export type RaiseEscalationFormData = z.infer<typeof raiseEscalationSchema>;

export const resolveEscalationSchema = z.object({
  resolutionComment: z
    .string()
    .min(5, 'Resolution comment must be at least 5 characters')
    .max(500, 'Resolution comment cannot exceed 500 characters')
    .describe('Resolution details'),
});

export type ResolveEscalationFormData = z.infer<typeof resolveEscalationSchema>;

export const escalationFilterSchema = z.object({
  status: z.enum(['Pending', 'In Review', 'Resolved', 'Cancelled']).optional(),
  level: z.enum(['1', '2']).optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
});

export type EscalationFilterFormData = z.infer<typeof escalationFilterSchema>;
