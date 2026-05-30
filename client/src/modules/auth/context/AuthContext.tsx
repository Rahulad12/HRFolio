import { createContext, useState, useCallback, useMemo, type ReactNode } from 'react'
import type { AuthUser, AuthState } from '../types/auth.types'

interface AuthContextValue extends AuthState {
  setCredentials: (user: AuthUser) => void
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)

function loadUser(): AuthUser | null {
  const token = localStorage.getItem('token')
  if (!token) return null
  return {
    token,
    username: localStorage.getItem('username') || '',
    email: localStorage.getItem('email') || '',
    picture: localStorage.getItem('picture') || '',
    Id: localStorage.getItem('Id') || '',
  }
}

function persistUser(user: AuthUser) {
  localStorage.setItem('token', user.token)
  localStorage.setItem('username', user.username)
  localStorage.setItem('email', user.email)
  localStorage.setItem('picture', user.picture || '')
  localStorage.setItem('googleLogin', 'true')
  localStorage.setItem('Id', user.Id)
}

function clearPersistedUser() {
  localStorage.removeItem('token')
  localStorage.removeItem('username')
  localStorage.removeItem('email')
  localStorage.removeItem('picture')
  localStorage.removeItem('googleLogin')
  localStorage.removeItem('Id')
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(loadUser)

  const setCredentials = useCallback((newUser: AuthUser) => {
    persistUser(newUser)
    setUser(newUser)
  }, [])

  const logout = useCallback(() => {
    clearPersistedUser()
    setUser(null)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({ user, isAuthenticated: !!user, isLoading: false, setCredentials, logout }),
    [user, setCredentials, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
