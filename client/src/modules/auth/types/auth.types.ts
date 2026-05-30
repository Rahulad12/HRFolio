export interface AuthUser {
  token: string
  username: string
  email: string
  picture: string
  Id: string
}

export interface GoogleLoginPayload {
  token: string
  email: string
  name: string
  picture: string
  loggedIn: string
  Id: string
}

export interface AuthResponse {
  success: boolean
  user?: AuthUser
  message?: string
}

export interface AuthState {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
}
