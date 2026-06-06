import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { fetchMyPermissions } from '@/shared/lib/api/permission.api'
import { useAuth } from '@/shared/hooks/useAuth'

interface PermissionContextValue {
  permissions: string[]
  can: (key: string) => boolean
  isLoaded: boolean
}

const PermissionContext = createContext<PermissionContextValue>({
  permissions: [],
  can: () => false,
  isLoaded: false,
})

export function PermissionProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth()
  const [permissions, setPermissions] = useState<string[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (!isAuthenticated || !user?.Id) {
      setPermissions([])
      setIsLoaded(false)
      return
    }
    setIsLoaded(false)
    fetchMyPermissions()
      .then((res) => setPermissions(res.data))
      .catch(() => setPermissions([]))
      .finally(() => setIsLoaded(true))
  }, [isAuthenticated, user?.Id])

  const can = (key: string) => permissions.includes(key)

  return (
    <PermissionContext.Provider value={{ permissions, can, isLoaded }}>
      {children}
    </PermissionContext.Provider>
  )
}

export function usePermissionContext() {
  return useContext(PermissionContext)
}
