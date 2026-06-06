import { DELETE, GET, PATCH, POST } from '@/shared/lib/axios'
import { AUTH_URL } from '@/shared/constants/api'
import type { UserListResponse, UserResponse } from '../../types/user.types'

export async function fetchUsers(params?: Record<string, unknown>): Promise<UserListResponse> {
  return GET<UserListResponse>(`/${AUTH_URL}/users`, params)
}

export async function fetchTeamByRole(role: string): Promise<UserListResponse> {
  return GET<UserListResponse>(`/${AUTH_URL}/team`, { role })
}

export async function createUser(payload: { name: string; email: string; role: string }): Promise<UserResponse> {
  return POST<UserResponse>(`/${AUTH_URL}/users`, payload)
}

export async function toggleUserStatus(id: string): Promise<{ success: boolean; message: string }> {
  return DELETE<{ success: boolean; message: string }>(`/${AUTH_URL}/${id}`)
}

export async function updateUserRole(id: string, role: string): Promise<UserResponse> {
  return PATCH<UserResponse>(`/${AUTH_URL}/${id}/role`, { role })
}
