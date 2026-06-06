import { z } from 'zod'

export const updateRoleSchema = z.object({
  role: z.enum(['HR', 'HR Admin', 'Admin'], { error: 'Role is required' }),
})

export type UpdateRoleFormValues = z.infer<typeof updateRoleSchema>

export const createUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  role: z.enum(['HR', 'HR Admin', 'Admin'], { error: 'Role is required' }),
})

export type CreateUserFormValues = z.infer<typeof createUserSchema>
