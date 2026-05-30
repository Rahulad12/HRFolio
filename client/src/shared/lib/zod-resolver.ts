import { z } from 'zod'

export async function zodResolver<T extends z.ZodType>(schema: T, values: unknown): Promise<z.infer<T>> {
  const result = schema.safeParse(values)
  if (!result.success) {
    const firstError = result.error.issues[0]
    throw new Error(firstError?.message || 'Validation failed')
  }
  return result.data
}
