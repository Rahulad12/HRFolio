import { GET, POST } from '@/shared/lib/axios'
import type { GoogleLoginPayload, AuthResponse } from '../types/auth.types'
import { AUTH_URL } from '@/shared/constants/api'

export async function googleLogin(payload: GoogleLoginPayload): Promise<AuthResponse> {
  return POST<AuthResponse>(`/${AUTH_URL}/google`, payload)
}

export async function deleteUser(id: string): Promise<{ success: boolean; message: string }> {
  return POST<{ success: boolean; message: string }>(`/${AUTH_URL}/delete/${id}`)
}

export async function getCurrentUser(): Promise<{ success: boolean; user: { username: string; email: string; picture: string; Id: string } }> {
  return GET<{ success: boolean; user: { username: string; email: string; picture: string; Id: string } }>(`/${AUTH_URL}/me`)
}
