export type UserRole = 'HR' | 'HR Admin' | 'Admin'
export type UserStatus = 'active' | 'inactive'

export interface User {
  _id: string
  name: string
  email: string
  googleId?: string
  picture?: string
  role: UserRole
  isLoggedIn: boolean
  status: UserStatus
  createdAt: string
  updatedAt: string
}

export interface UserListResponse {
  success: boolean
  message: string
  data: User[]
}

export interface UserResponse {
  success: boolean
  message: string
  data: User
}
