import { usePermissionContext } from '@/shared/context/PermissionContext'

export function usePermissions() {
  const { can, permissions, isLoaded } = usePermissionContext()
  return { can, permissions, isLoaded }
}
