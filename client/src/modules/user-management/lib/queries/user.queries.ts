import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as userApi from '../api/user.api'

const USERS_KEY = ['users'] as const

export function useUserList(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: [...USERS_KEY, params],
    queryFn: () => userApi.fetchUsers(params),
  })
}

export function useTeamByRole(role: string) {
  return useQuery({
    queryKey: [...USERS_KEY, 'team', role],
    queryFn: () => userApi.fetchTeamByRole(role),
    enabled: !!role,
    staleTime: 60000,
  })
}

export function useCreateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: { name: string; email: string; role: string }) => userApi.createUser(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: USERS_KEY }),
  })
}

export function useToggleUserStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => userApi.toggleUserStatus(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: USERS_KEY }),
  })
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) => userApi.updateUserRole(id, role),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: USERS_KEY }),
  })
}
