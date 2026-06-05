import { GET, PATCH } from '@/shared/lib/axios'

export function fetchMyPermissions(): Promise<{ success: boolean; data: string[] }> {
  return GET<{ success: boolean; data: string[] }>('auth/me/permissions')
}

export interface RolePermsDoc {
  role: string
  locked: boolean
  permissions: Record<string, boolean>
}

export function fetchAllRolePermissions(): Promise<{ success: boolean; data: RolePermsDoc[] }> {
  return GET<{ success: boolean; data: RolePermsDoc[] }>('auth/role-permissions')
}

export function updateRolePermission(role: string, key: string, value: boolean): Promise<{ success: boolean }> {
  return PATCH<{ success: boolean }>('auth/role-permissions', { role, key, value })
}
