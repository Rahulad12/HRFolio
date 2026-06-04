import type { LookupValue } from '@/modules/lookup'

export function getLookupLabel(values: LookupValue[] | undefined, systemName: string): string {
  if (!values) return systemName
  return values.find(v => v.systemName === systemName)?.displayName ?? systemName
}

export function getLookupColor(values: LookupValue[] | undefined, systemName: string): string {
  if (!values) return 'default'
  return values.find(v => v.systemName === systemName)?.color ?? 'default'
}
