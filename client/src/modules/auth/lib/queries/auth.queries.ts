import { useMutation } from '@tanstack/react-query'
import { queryClient } from '@/shared/lib/query-client'
import * as authApi from '../api/auth.api'
import type { GoogleLoginPayload } from '../../types/auth.types'

export function useGoogleLogin() {
  return useMutation({
    mutationFn: (payload: GoogleLoginPayload) => authApi.googleLogin(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth'] })
    },
  })
}

export function useDeleteUser() {
  return useMutation({
    mutationFn: (id: string) => authApi.deleteUser(id),
  })
}
