# Redux → React Query + Module Restructure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace Redux Toolkit with TanStack React Query + Zustand + Zod, restructure flat `src/` into feature-based modules per module-structure.md

**Architecture:** Axios HTTP layer in `shared/lib/`, auth in React Context, UI state in Zustand, server state in React Query, form validation in Zod. 8 modules under `modules/` sharing a `shared/` layer.

**Tech Stack:** React 18 + TypeScript + Vite + Ant Design + TanStack React Query + Zustand + Zod + axios

---

## Task List

### Task 1: Foundation — Dependencies & Config

**Files:**
- Modify: `client/package.json`
- Modify: `client/vite.config.ts`
- Modify: `client/tsconfig.json`
- Modify: `client/tsconfig.app.json`
- Create: `client/src/shared/lib/axios.ts`
- Create: `client/src/shared/lib/query-client.ts`
- Create: `client/src/shared/constants/api.ts`

- [ ] **Step 1: Install dependencies**

```bash
cd /home/rahul-adhikari/code/own-projects/HRFolio/client
npm install axios @tanstack/react-query zustand zod
npm install -D @tanstack/react-query-devtools
```

- [ ] **Step 2: Configure `@/` path alias in vite.config.ts**

Read `client/vite.config.ts`, then edit:

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
})
```

- [ ] **Step 3: Configure `@/` path mapping in tsconfig.json**

Read `client/tsconfig.json`, then add to `compilerOptions`:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

Also update `client/tsconfig.app.json` if it overrides paths — add the same `paths` block.

- [ ] **Step 4: Create `shared/lib/axios.ts`**

```ts
import axios, { AxiosError } from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly errors?: Record<string, string[]>,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

const client = axios.create({ baseURL: API_BASE_URL })

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

function handleError(error: unknown): never {
  if (error instanceof AxiosError) {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    const data = error.response?.data as Record<string, unknown> | undefined
    throw new ApiError(
      error.response?.status || 500,
      (data?.message as string) || error.message || 'Unknown error',
      data?.errors as Record<string, string[]> | undefined,
    )
  }
  throw new ApiError(500, 'Network error')
}

export async function GET<T>(url: string, params?: Record<string, unknown>): Promise<T> {
  try {
    const { data } = await client.get<T>(url, { params })
    return data
  } catch (error) {
    return handleError(error)
  }
}

export async function POST<T>(url: string, body?: unknown): Promise<T> {
  try {
    const { data } = await client.post<T>(url, body)
    return data
  } catch (error) {
    return handleError(error)
  }
}

export async function PUT<T>(url: string, body?: unknown): Promise<T> {
  try {
    const { data } = await client.put<T>(url, body)
    return data
  } catch (error) {
    return handleError(error)
  }
}

export async function PATCH<T>(url: string, body?: unknown): Promise<T> {
  try {
    const { data } = await client.patch<T>(url, body)
    return data
  } catch (error) {
    return handleError(error)
  }
}

export async function DELETE<T>(url: string): Promise<T> {
  try {
    const { data } = await client.delete<T>(url)
    return data
  } catch (error) {
    return handleError(error)
  }
}
```

- [ ] **Step 5: Create `shared/lib/query-client.ts`**

```ts
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})
```

- [ ] **Step 6: Create `shared/constants/api.ts`**

```ts
import { AUTH_URL, CANDIDATE_URL, INTERVIEW_URL, INTERVIEWER_URL, ASSESSMENT_URL, EMAIL_TEMPLATE_URL, OFFER_URL } from '@/constant'
export { AUTH_URL, CANDIDATE_URL, INTERVIEW_URL, INTERVIEWER_URL, ASSESSMENT_URL, EMAIL_TEMPLATE_URL, OFFER_URL }
```

- [ ] **Step 7: Commit**

```bash
git add -A && git commit -m "feat: add axios, react-query, zustand, zod deps + @/ alias + shared lib"
```

---

### Task 2: Zustand UI Stores

**Files:**
- Create: `client/src/shared/store/theme.store.ts`
- Create: `client/src/shared/store/sidebar.store.ts`
- Create: `client/src/shared/store/search.store.ts`
- Create: `client/src/shared/store/button.store.ts`

- [ ] **Step 1: Create `shared/store/theme.store.ts`**

```ts
import { create } from 'zustand'

type ThemeMode = 'light' | 'dark'

interface ThemeStore {
  mode: ThemeMode
  setThemeMode: (mode: ThemeMode) => void
  toggleThemeMode: () => void
}

const getInitialMode = (): ThemeMode => {
  const saved = localStorage.getItem('themeMode')
  return saved === 'dark' ? 'dark' : 'light'
}

export const useThemeStore = create<ThemeStore>((set) => ({
  mode: getInitialMode(),
  setThemeMode: (mode) => {
    localStorage.setItem('themeMode', mode)
    set({ mode })
  },
  toggleThemeMode: () =>
    set((state) => {
      const mode = state.mode === 'light' ? 'dark' : 'light'
      localStorage.setItem('themeMode', mode)
      return { mode }
    }),
}))
```

- [ ] **Step 2: Create `shared/store/sidebar.store.ts`**

```ts
import { create } from 'zustand'

interface SidebarStore {
  collapsed: boolean
  toggle: () => void
}

export const useSidebarStore = create<SidebarStore>((set) => ({
  collapsed: false,
  toggle: () => set((state) => ({ collapsed: !state.collapsed })),
}))
```

- [ ] **Step 3: Create `shared/store/search.store.ts`**

```ts
import { create } from 'zustand'

interface CandidateSearch {
  text: string
  status: string
}

interface SearchStore {
  candidateSearch: CandidateSearch
  setCandidateSearch: (search: CandidateSearch) => void
  searchTerms: string
  setSearchTerms: (text: string) => void
}

export const useSearchStore = create<SearchStore>((set) => ({
  candidateSearch: { text: '', status: '' },
  setCandidateSearch: (candidateSearch) => set({ candidateSearch }),
  searchTerms: '',
  setSearchTerms: (searchTerms) => set({ searchTerms }),
}))
```

- [ ] **Step 4: Create `shared/store/button.store.ts`**

```ts
import { create } from 'zustand'
import type { ReactNode } from 'react'

interface ButtonState {
  text: string
  icon?: ReactNode
  onClick?: () => void
  disabled?: boolean
  loading?: boolean
}

interface ButtonStore {
  button: ButtonState
  setButtonState: (state: ButtonState) => void
}

export const useButtonStore = create<ButtonStore>((set) => ({
  button: { text: '', disabled: false, loading: false },
  setButtonState: (button) => set({ button }),
}))
```

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add Zustand stores for theme, sidebar, search, button"
```

---

### Task 3: Auth Context + Auth Module

**Files:**
- Create: `client/src/shared/hooks/useAuth.tsx`
- Create: `client/src/modules/auth/types/auth.types.ts`
- Create: `client/src/modules/auth/lib/api/auth.api.ts`
- Create: `client/src/modules/auth/routes/auth.routes.tsx`
- Create: `client/src/modules/auth/pages/login-page.tsx`
- Create: `client/src/modules/auth/components/GoogleLoginButton.tsx`
- Create: `client/src/modules/auth/components/AuthLayout.tsx`
- Create: `client/src/modules/auth/pages/welcome-back-page.tsx`
- Create: `client/src/modules/auth/index.ts`

- [ ] **Step 1: Create `shared/hooks/useAuth.tsx`**

```tsx
import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { useNavigate } from 'react-router'

interface User {
  username: string
  email: string
  token: string
  picture: string | null
  loggedIn: boolean
  Id: string
}

interface AuthContextValue {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (user: User) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      setUser({
        username: localStorage.getItem('username') || '',
        email: localStorage.getItem('email') || '',
        token,
        picture: localStorage.getItem('picture'),
        loggedIn: localStorage.getItem('googleLogin') === 'true',
        Id: localStorage.getItem('Id') || '',
      })
    }
    setIsLoading(false)
  }, [])

  const login = useCallback((userData: User) => {
    localStorage.setItem('token', userData.token)
    localStorage.setItem('username', userData.username)
    localStorage.setItem('email', userData.email)
    if (userData.picture) localStorage.setItem('picture', userData.picture)
    localStorage.setItem('googleLogin', String(userData.loggedIn))
    localStorage.setItem('Id', userData.Id)
    setUser(userData)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    localStorage.removeItem('email')
    localStorage.removeItem('picture')
    localStorage.removeItem('googleLogin')
    localStorage.removeItem('Id')
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
```

- [ ] **Step 2: Create `modules/auth/types/auth.types.ts`**

```ts
export interface AuthUser {
  username: string
  email: string
  token: string
  picture: string | null
  loggedIn: boolean
  Id: string
}

export interface AuthResponse {
  success: boolean
  message: string
  user: AuthUser
}

export interface GlobalResponse {
  success: boolean
  message: string
}
```

- [ ] **Step 3: Create `modules/auth/lib/api/auth.api.ts`**

```ts
import { POST, DELETE } from '@/shared/lib/axios'
import { AUTH_URL } from '@/shared/constants/api'
import type { AuthResponse, GlobalResponse } from '../../types/auth.types'

export function googleLogin(): Promise<AuthResponse> {
  return POST<AuthResponse>(`${AUTH_URL}/google`)
}

export function deleteUser(id: string): Promise<GlobalResponse> {
  return DELETE<GlobalResponse>(`${AUTH_URL}/${id}`)
}
```

- [ ] **Step 4: Create `modules/auth/routes/auth.routes.tsx`**

```tsx
import { lazy } from 'react'

const LoginPage = lazy(() => import('../pages/login-page'))
const WelcomeBackPage = lazy(() => import('../pages/welcome-back-page'))

export const authRoutes = [
  { path: '/login', element: <LoginPage /> },
  { path: '/welcome-back', element: <WelcomeBackPage /> },
]
```

- [ ] **Step 5: Create `modules/auth/pages/login-page.tsx`**

Copy the logic from `client/src/pages/auth/LoginPage.tsx`:

```tsx
import { AuthLayout } from '../components/AuthLayout'

export default function LoginPage() {
  return <AuthLayout />
}
```

- [ ] **Step 6: Create `modules/auth/components/AuthLayout.tsx`**

Copy from `client/src/component/auth/AuthLayout.tsx` — same content.

- [ ] **Step 7: Create `modules/auth/components/GoogleLoginButton.tsx`**

Copy from `client/src/component/auth/AuthForm.tsx` — same content.

- [ ] **Step 8: Create `modules/auth/pages/welcome-back-page.tsx`**

Copy from `client/src/component/auth/WelcomeBackPage.tsx` — same content.

- [ ] **Step 9: Create `modules/auth/index.ts`**

```ts
export { authRoutes } from './routes/auth.routes'
export type { AuthUser, AuthResponse, GlobalResponse } from './types/auth.types'
```

- [ ] **Step 10: Commit**

```bash
git add -A && git commit -m "feat: add AuthContext + auth module"
```

---

### Task 4: Candidates Module

**Files:**
- Create: `client/src/modules/candidates/types/candidate.types.ts`
- Create: `client/src/modules/candidates/schemas/candidate.schema.ts`
- Create: `client/src/modules/candidates/lib/api/candidate.api.ts`
- Create: `client/src/modules/candidates/lib/queries/candidate.queries.ts`
- Create: `client/src/modules/candidates/lib/mutations/candidate.mutations.ts`
- Create: `client/src/modules/candidates/routes/candidate.routes.tsx`
- Create: `client/src/modules/candidates/pages/list-page.tsx`
- Create: `client/src/modules/candidates/pages/detail-page.tsx`
- Create: `client/src/modules/candidates/pages/form-page.tsx`
- Create: `client/src/modules/candidates/components/CandidateHistory.tsx`
- Create: `client/src/modules/candidates/components/CandidateInfo.tsx`
- Create: `client/src/modules/candidates/components/CandidateQuickAction.tsx`
- Create: `client/src/modules/candidates/components/CandidateTimeLine.tsx`
- Create: `client/src/modules/candidates/index.ts`

- [ ] **Step 1: Create `types/candidate.types.ts`**

Extract candidate-related types from `src/types/index.ts`:

```ts
export type CandidateStatus = 'shortlisted' | 'assessment' | 'first' | 'second' | 'third' | 'offered' | 'hired' | 'rejected'

export interface ReferenceData {
  name: string
  contact: string
  relation: string
}

export interface ReferenceResponse {
  _id: string
  name: string
  contact: string
  relation: string
}

export interface CandidateProgress {
  shortlisted: { completed: boolean; date: string }
  first: { completed: boolean; date: string }
  second: { completed: boolean; date: string }
  third: { completed: boolean; date: string }
  assessment: { completed: boolean; date: string }
  offered: { completed: boolean; date: string }
  hired: { completed: boolean; date: string }
  rejected: { completed: boolean; date: string }
}

export interface CandidateFormData {
  name: string
  email: string
  phone: string
  technology: string
  level: string
  experience: number
  expectedsalary: number
  references: ReferenceData[]
  applieddate: string | null
  resume: string | null
  status: CandidateStatus
  progress: CandidateProgress
}

export interface CandidateData {
  _id: string
  name: string
  email: string
  phone: string
  technology: string
  level: string
  experience: number
  expectedsalary: number
  references: ReferenceResponse[]
  status: CandidateStatus
  resume: string
  applieddate: string
  progress: CandidateProgress
  createdAt: string
  updatedAt: string
}

export interface CandidateFilter {
  searchText: string
  status: string
}

export interface CandidateResponse {
  success: boolean
  message: string
  data: CandidateData[]
}

export interface CandidateIdResponse {
  success: boolean
  message: string
  data: CandidateData
}

export interface CandidateLog {
  _id: string
  candidate: CandidateData
  action: string
  createdAt: string
  updatedAt: string
  performedAt: string
}

export interface CandidateLogResponse {
  success: boolean
  message: string
  data: CandidateLog[]
}
```

- [ ] **Step 2: Create `schemas/candidate.schema.ts`**

```ts
import { z } from 'zod'

export const candidateFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(1, 'Phone is required'),
  technology: z.string().min(1, 'Technology is required'),
  level: z.enum(['junior', 'mid', 'senior']),
  experience: z.number().min(0, 'Experience must be positive'),
  expectedsalary: z.number().min(0, 'Salary must be positive'),
  applieddate: z.string().nullable(),
  resume: z.string().nullable(),
  status: z.string(),
  progress: z.any().optional(),
  references: z.array(z.object({
    name: z.string().min(1, 'Reference name is required'),
    contact: z.string().min(1, 'Reference contact is required'),
    relation: z.string().min(1, 'Reference relation is required'),
  })),
})

export const candidateFormDefaults = {
  name: '',
  email: '',
  phone: '',
  technology: '',
  level: 'mid' as const,
  experience: 0,
  expectedsalary: 0,
  applieddate: null,
  resume: null,
  status: 'shortlisted',
  references: [],
}

export type CandidateFormValues = z.infer<typeof candidateFormSchema>
```

- [ ] **Step 3: Create `lib/api/candidate.api.ts`**

```ts
import { GET, POST, PUT, DELETE } from '@/shared/lib/axios'
import { CANDIDATE_URL } from '@/shared/constants/api'
import type { CandidateResponse, CandidateIdResponse, CandidateFormData, CandidateFilter, GlobalResponse, CandidateLogResponse } from '../../types/candidate.types'

export function getCandidates(filters?: CandidateFilter): Promise<CandidateResponse> {
  return GET<CandidateResponse>(CANDIDATE_URL, filters as Record<string, unknown>)
}

export function getCandidateById(id: string): Promise<CandidateIdResponse> {
  return GET<CandidateIdResponse>(`${CANDIDATE_URL}/${id}`)
}

export function createCandidate(data: CandidateFormData): Promise<GlobalResponse> {
  return POST<GlobalResponse>(CANDIDATE_URL, data)
}

export function updateCandidate(id: string, data: CandidateFormData): Promise<CandidateIdResponse> {
  return PUT<CandidateIdResponse>(`${CANDIDATE_URL}/${id}`, data)
}

export function deleteCandidate(ids: string[] | Record<string, unknown>): Promise<GlobalResponse> {
  return DELETE<GlobalResponse>(`${CANDIDATE_URL}`)
  // Note: original sends body with DELETE — may need adjustment
}

export function changeCandidateStage(id: string, status: string): Promise<CandidateIdResponse> {
  return PUT<CandidateIdResponse>(`${CANDIDATE_URL}/stage/${id}`, { status })
}

export function rejectCandidate(id: string): Promise<GlobalResponse> {
  return PUT<GlobalResponse>(`${CANDIDATE_URL}/reject/${id}`)
}

export function getCandidateLogs(candidateId: string): Promise<CandidateLogResponse> {
  return GET<CandidateLogResponse>(`${CANDIDATE_URL}/logs/${candidateId}`)
}
```

- [ ] **Step 4: Create `lib/queries/candidate.queries.ts`**

```ts
import { queryOptions } from '@tanstack/react-query'
import { getCandidates, getCandidateById, getCandidateLogs } from '../api/candidate.api'
import type { CandidateFilter } from '../../types/candidate.types'

export const candidateListOptions = (filters?: CandidateFilter) =>
  queryOptions({
    queryKey: ['candidates', 'list', filters],
    queryFn: () => getCandidates(filters),
  })

export const candidateDetailOptions = (id: string) =>
  queryOptions({
    queryKey: ['candidates', 'detail', id],
    queryFn: () => getCandidateById(id),
    enabled: !!id,
  })

export const candidateLogsOptions = (candidateId: string) =>
  queryOptions({
    queryKey: ['candidates', 'logs', candidateId],
    queryFn: () => getCandidateLogs(candidateId),
    enabled: !!candidateId,
  })
```

- [ ] **Step 5: Create `lib/mutations/candidate.mutations.ts`**

```ts
import { mutationOptions } from '@tanstack/react-query'
import { queryClient } from '@/shared/lib/query-client'
import { createCandidate, updateCandidate, deleteCandidate, changeCandidateStage, rejectCandidate } from '../api/candidate.api'
import type { CandidateFormData } from '../../types/candidate.types'

export const createCandidateMutation = mutationOptions({
  mutationFn: (data: CandidateFormData) => createCandidate(data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['candidates'] })
  },
})

export const updateCandidateMutation = mutationOptions({
  mutationFn: ({ id, data }: { id: string; data: CandidateFormData }) => updateCandidate(id, data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['candidates'] })
  },
})

export const deleteCandidateMutation = mutationOptions({
  mutationFn: (ids: string[]) => deleteCandidate(ids),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['candidates'] })
  },
})

export const changeStageMutation = mutationOptions({
  mutationFn: ({ id, status }: { id: string; status: string }) => changeCandidateStage(id, status),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['candidates'] })
  },
})

export const rejectCandidateMutation = mutationOptions({
  mutationFn: (id: string) => rejectCandidate(id),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['candidates'] })
  },
})
```

- [ ] **Step 6: Create `routes/candidate.routes.tsx`**

```tsx
import { lazy } from 'react'

const CandidateListPage = lazy(() => import('../pages/list-page'))
const CandidateDetailPage = lazy(() => import('../pages/detail-page'))
const CandidateFormPage = lazy(() => import('../pages/form-page'))

export const candidateRoutes = [
  { path: '/dashboard/candidates', element: <CandidateListPage /> },
  { path: '/dashboard/candidates/new', element: <CandidateFormPage /> },
  { path: '/dashboard/candidates/:id', element: <CandidateDetailPage /> },
  { path: '/dashboard/candidates/edit/:id', element: <CandidateFormPage /> },
]
```

- [ ] **Step 7: Create `pages/list-page.tsx`**

Migrate from `src/pages/candidates/CandidateList.tsx`:
- Replace `useGetCandidateQuery(filters)` → `useQuery(candidateListOptions(filters))`
- Replace Redux selectors for search → `useSearchStore()`
- Component content stays identical

```tsx
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { candidateListOptions } from '../lib/queries/candidate.queries'
import { useSearchStore } from '@/shared/store/search.store'
// ... rest of imports from the original CandidateList.tsx

export default function CandidateTable() {
  const { candidateSearch } = useSearchStore()
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const { data, isLoading } = useQuery(candidateListOptions(candidateSearch))

  // ... rest of the component is identical
}
```

- [ ] **Step 8: Create `pages/detail-page.tsx`**

Migrate from `src/pages/candidates/CandidateDetail.tsx`:
- Replace `useGetCandidateByIdQuery(id)` → `useQuery(candidateDetailOptions(id))`
- Replace `useGetCandidateLogsByCandidateIdQuery(id)` → `useQuery(candidateLogsOptions(id))`

- [ ] **Step 9: Create `pages/form-page.tsx`**

Migrate from `src/pages/candidates/CandidateForm.tsx`:
- Replace `useCreateCandidateMutation()` → `useMutation(createCandidateMutation)`
- Replace `useUpdateCandidateMutation()` → `useMutation(updateCandidateMutation)`

- [ ] **Step 10: Create migration copies for all candidate components**

Copy `CandidateHistory.tsx`, `CandidateInfo.tsx`, `CandidateQuickAction.tsx`, `CandidateTimeLine.tsx` from `src/component/candidate/` to `modules/candidates/components/`. No code changes needed — they use props, not Redux.

- [ ] **Step 11: Create `index.ts`**

```ts
export { candidateRoutes } from './routes/candidate.routes'
export type {
  CandidateData, CandidateFormData, CandidateFilter,
  CandidateResponse, CandidateStatus, CandidateProgress,
} from './types/candidate.types'
export { candidateFormSchema, candidateFormDefaults } from './schemas/candidate.schema'
```

- [ ] **Step 12: Commit**

```bash
git add -A && git commit -m "feat: add candidates module with API, queries, mutations, pages"
```

---

### Task 5: Interviews Module

**Files:**
- Create: `client/src/modules/interviews/types/interview.types.ts`
- Create: `client/src/modules/interviews/schemas/interview.schema.ts`
- Create: `client/src/modules/interviews/lib/api/interview.api.ts`
- Create: `client/src/modules/interviews/lib/api/interviewer.api.ts`
- Create: `client/src/modules/interviews/lib/queries/interview.queries.ts`
- Create: `client/src/modules/interviews/lib/mutations/interview.mutations.ts`
- Create: `client/src/modules/interviews/routes/interview.routes.tsx`
- Create: `client/src/modules/interviews/pages/list-page.tsx`
- Create: `client/src/modules/interviews/pages/schedule-page.tsx`
- Create: `client/src/modules/interviews/pages/calendar-page.tsx`
- Create: `client/src/modules/interviews/pages/interviewer-list-page.tsx`
- Create: `client/src/modules/interviews/pages/interviewer-form-page.tsx`
- Create: `client/src/modules/interviews/components/InterviewDetailsModal.tsx`
- Create: `client/src/modules/interviews/components/InterviewListView.tsx`
- Create: `client/src/modules/interviews/index.ts`

- [ ] **Step 1: Create `types/interview.types.ts`**

Extract interview + interviewer types from `src/types/index.ts`:

```ts
export type InterviewStatus = 'draft' | 'scheduled' | 'completed' | 'cancelled' | 'failed'
export type InterviewRound = 'first' | 'second' | 'third'

export interface InterviewerData {
  _id: string
  name: string
  email: string
  department: string
  position: string
  createdAt: string
  updatedAt: string
}

export interface InterviewData {
  candidate: Record<string, unknown>
  interviewer: InterviewerData
  date: string | null
  time: string | null
  type: 'phone' | 'video' | 'in-person'
  feedback: string
  rating: number
  notes: string
  status: InterviewStatus
  InterviewRound: InterviewRound
  meetingLink: string
  _id: string
  createdAt: string
  updatedAt: string
}

export interface InterviewResponse {
  success: boolean
  message: string
  data?: InterviewData[]
}

export interface InterviewerResponse {
  success: boolean
  message: string
  data: InterviewerData[]
}

export interface InterviewerIdResponse {
  success: boolean
  message: string
  data: InterviewerData
}

export interface InterviewLogData {
  _id: string
  interviewId: InterviewData
  candidate: Record<string, unknown>
  interviewer: InterviewerData
  action: string
  details: Record<string, unknown>
  createdAt: string
  updatedAt: string
  performedBy: string
  performedAt: string
}

export interface InterviewLogResponse {
  success: boolean
  message: string
  data: InterviewLogData[]
}
```

- [ ] **Step 2: Create `schemas/interview.schema.ts`**

```ts
import { z } from 'zod'

export const interviewFormSchema = z.object({
  candidate: z.string().min(1, 'Candidate is required'),
  interviewer: z.string().min(1, 'Interviewer is required'),
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  type: z.enum(['phone', 'video', 'in-person']),
  status: z.enum(['draft', 'scheduled', 'completed', 'cancelled', 'failed']),
  InterviewRound: z.enum(['first', 'second', 'third']),
  notes: z.string().optional(),
  feedback: z.string().optional(),
  rating: z.number().optional(),
  meetingLink: z.string().optional(),
})

export const interviewerFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  department: z.string().min(1, 'Department is required'),
  position: z.string().min(1, 'Position is required'),
})

export type InterviewFormValues = z.infer<typeof interviewFormSchema>
export type InterviewerFormValues = z.infer<typeof interviewerFormSchema>
```

- [ ] **Step 3: Create `lib/api/interview.api.ts`**

```ts
import { GET, POST, PUT, DELETE } from '@/shared/lib/axios'
import { INTERVIEW_URL } from '@/shared/constants/api'
import type { InterviewResponse } from '../../types/interview.types'

export function getInterviews(): Promise<InterviewResponse> {
  return GET<InterviewResponse>(INTERVIEW_URL)
}

export function getInterviewById(id: string): Promise<InterviewResponse> {
  return GET<InterviewResponse>(`${INTERVIEW_URL}/${id}`)
}

export function getInterviewsByCandidate(candidateId: string): Promise<InterviewResponse> {
  return GET<InterviewResponse>(`${INTERVIEW_URL}/candidate/${candidateId}`)
}

export function createInterview(data: Record<string, unknown>): Promise<InterviewResponse> {
  return POST<InterviewResponse>(INTERVIEW_URL, data)
}

export function updateInterview(id: string, data: Record<string, unknown>): Promise<InterviewResponse> {
  return PUT<InterviewResponse>(`${INTERVIEW_URL}/${id}`, data)
}

export function deleteInterview(id: string): Promise<InterviewResponse> {
  return DELETE<InterviewResponse>(`${INTERVIEW_URL}/${id}`)
}

export function getInterviewLog(): Promise<InterviewResponse> {
  return GET<InterviewResponse>(`${INTERVIEW_URL}/log`)
}

export function getInterviewLogByCandidate(candidateId: string): Promise<InterviewResponse> {
  return GET<InterviewResponse>(`${INTERVIEW_URL}/log/candidate/${candidateId}`)
}
```

- [ ] **Step 4: Create `lib/api/interviewer.api.ts`**

```ts
import { GET, POST, PUT, DELETE } from '@/shared/lib/axios'
import { INTERVIEWER_URL } from '@/shared/constants/api'
import type { InterviewerResponse, InterviewerIdResponse } from '../../types/interview.types'

export function getInterviewers(): Promise<InterviewerResponse> {
  return GET<InterviewerResponse>(INTERVIEWER_URL)
}

export function getInterviewerById(id: string): Promise<InterviewerIdResponse> {
  return GET<InterviewerIdResponse>(`${INTERVIEWER_URL}/${id}`)
}

export function createInterviewer(data: Record<string, unknown>): Promise<InterviewerResponse> {
  return POST<InterviewerResponse>(INTERVIEWER_URL, data)
}

export function updateInterviewer(id: string, data: Record<string, unknown>): Promise<InterviewerResponse> {
  return PUT<InterviewerResponse>(`${INTERVIEWER_URL}/${id}`, data)
}

export function deleteInterviewer(id: string): Promise<InterviewerResponse> {
  return DELETE<InterviewerResponse>(`${INTERVIEWER_URL}/${id}`)
}
```

- [ ] **Step 5: Create `lib/queries/interview.queries.ts`**

```ts
import { queryOptions } from '@tanstack/react-query'
import { getInterviews, getInterviewById, getInterviewsByCandidate, getInterviewLog, getInterviewLogByCandidate } from '../api/interview.api'
import { getInterviewers } from '../api/interviewer.api'

export const interviewListOptions = () =>
  queryOptions({
    queryKey: ['interviews', 'list'],
    queryFn: () => getInterviews(),
  })

export const interviewDetailOptions = (id: string) =>
  queryOptions({
    queryKey: ['interviews', 'detail', id],
    queryFn: () => getInterviewById(id),
    enabled: !!id,
  })

export const interviewByCandidateOptions = (candidateId: string) =>
  queryOptions({
    queryKey: ['interviews', 'candidate', candidateId],
    queryFn: () => getInterviewsByCandidate(candidateId),
    enabled: !!candidateId,
  })

export const interviewerListOptions = () =>
  queryOptions({
    queryKey: ['interviewers', 'list'],
    queryFn: () => getInterviewers(),
  })

export const interviewLogOptions = () =>
  queryOptions({
    queryKey: ['interviews', 'log'],
    queryFn: () => getInterviewLog(),
  })

export const interviewLogByCandidateOptions = (candidateId: string) =>
  queryOptions({
    queryKey: ['interviews', 'log', candidateId],
    queryFn: () => getInterviewLogByCandidate(candidateId),
    enabled: !!candidateId,
  })
```

- [ ] **Step 6: Create `lib/mutations/interview.mutations.ts`**

```ts
import { mutationOptions } from '@tanstack/react-query'
import { queryClient } from '@/shared/lib/query-client'
import { createInterview, updateInterview, deleteInterview } from '../api/interview.api'
import { createInterviewer, updateInterviewer, deleteInterviewer } from '../api/interviewer.api'

export const createInterviewMutation = mutationOptions({
  mutationFn: (data: Record<string, unknown>) => createInterview(data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['interviews'] })
    queryClient.invalidateQueries({ queryKey: ['candidates'] })
  },
})

export const updateInterviewMutation = mutationOptions({
  mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) => updateInterview(id, data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['interviews'] })
    queryClient.invalidateQueries({ queryKey: ['candidates'] })
  },
})

export const deleteInterviewMutation = mutationOptions({
  mutationFn: (id: string) => deleteInterview(id),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['interviews'] })
    queryClient.invalidateQueries({ queryKey: ['candidates'] })
  },
})

export const createInterviewerMutation = mutationOptions({
  mutationFn: (data: Record<string, unknown>) => createInterviewer(data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['interviewers'] })
  },
})

export const updateInterviewerMutation = mutationOptions({
  mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) => updateInterviewer(id, data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['interviewers'] })
  },
})

export const deleteInterviewerMutation = mutationOptions({
  mutationFn: (id: string) => deleteInterviewer(id),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['interviewers'] })
  },
})
```

- [ ] **Step 7: Create `routes/interview.routes.tsx`**

```tsx
import { lazy } from 'react'

const InterviewListPage = lazy(() => import('../pages/list-page'))
const InterviewSchedulePage = lazy(() => import('../pages/schedule-page'))
const CalendarViewPage = lazy(() => import('../pages/calendar-page'))
const InterviewerListPage = lazy(() => import('../pages/interviewer-list-page'))
const InterviewerFormPage = lazy(() => import('../pages/interviewer-form-page'))

export const interviewRoutes = [
  { path: '/dashboard/interviews', element: <InterviewListPage /> },
  { path: '/dashboard/interviews/schedule', element: <InterviewSchedulePage /> },
  { path: '/dashboard/interviews/calendar', element: <CalendarViewPage /> },
  { path: '/dashboard/interviewers', element: <InterviewerListPage /> },
  { path: '/dashboard/interviewers/new', element: <InterviewerFormPage /> },
  { path: '/dashboard/interviewers/edit/:id', element: <InterviewerFormPage /> },
]
```

- [ ] **Step 8: Create pages + components**

For each page, migrate from the corresponding file in `src/pages/interviews/` and `src/pages/interviewers/`:
- Replace RTK Query hooks with `useQuery()` / `useMutation()` from the module's queries/mutations
- All component logic stays identical

Pages to migrate:
- `list-page.tsx` ← `src/pages/interviews/Interviews.tsx`
- `schedule-page.tsx` ← `src/pages/interviews/InterviewSchedule.tsx`
- `calendar-page.tsx` ← `src/pages/interviews/CalenderView.tsx`
- `interviewer-list-page.tsx` ← `src/pages/interviewers/InterviewerList.tsx`
- `interviewer-form-page.tsx` ← `src/pages/interviewers/InterviewerForm.tsx`

Components to migrate:
- `InterviewDetailsModal.tsx` ← `src/pages/interviews/InterviewDetailsModal.tsx`
- `InterviewListView.tsx` ← `src/pages/interviews/InterviewListView.tsx`

- [ ] **Step 9: Create `index.ts`**

```ts
export { interviewRoutes } from './routes/interview.routes'
export type { InterviewData, InterviewerData, InterviewStatus, InterviewRound } from './types/interview.types'
```

- [ ] **Step 10: Commit**

```bash
git add -A && git commit -m "feat: add interviews module with API, queries, mutations, pages"
```

---

### Task 6: Assessments Module

**Files:**
- Create: `client/src/modules/assessments/types/assessment.types.ts`
- Create: `client/src/modules/assessments/schemas/assessment.schema.ts`
- Create: `client/src/modules/assessments/lib/api/assessment.api.ts`
- Create: `client/src/modules/assessments/lib/queries/assessment.queries.ts`
- Create: `client/src/modules/assessments/lib/mutations/assessment.mutations.ts`
- Create: `client/src/modules/assessments/routes/assessment.routes.tsx`
- Create: `client/src/modules/assessments/pages/list-page.tsx`
- Create: `client/src/modules/assessments/pages/form-page.tsx`
- Create: `client/src/modules/assessments/pages/assign-page.tsx`
- Create: `client/src/modules/assessments/pages/assignment-list-page.tsx`
- Create: `client/src/modules/assessments/index.ts`

- [ ] **Step 1: Create `types/assessment.types.ts`**

Extract assessment types from `src/types/index.ts`.

- [ ] **Step 2: Create `schemas/assessment.schema.ts`**

```ts
import { z } from 'zod'

export const assessmentFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  type: z.enum(['behavioural', 'technical']),
  technology: z.string().min(1, 'Technology is required'),
  level: z.string().min(1, 'Level is required'),
  assessmentLink: z.string().url('Invalid URL'),
  duration: z.number().min(1, 'Duration is required'),
})

export const assignAssessmentSchema = z.object({
  candidate: z.array(z.string()).min(1, 'At least one candidate required'),
  assessment: z.string().min(1, 'Assessment is required'),
  dueDate: z.string().min(1, 'Due date is required'),
  emailTemplate: z.string().optional(),
})

export type AssessmentFormValues = z.infer<typeof assessmentFormSchema>
export type AssignAssessmentValues = z.infer<typeof assignAssessmentSchema>
```

- [ ] **Step 3: Create `lib/api/assessment.api.ts`**

Write all assessment/assignment/score API functions using GET/POST/PUT/DELETE helpers (following same pattern as candidates).

- [ ] **Step 4: Create `lib/queries/assessment.queries.ts`**

queryOptions for: assessmentList, assessmentById, assignmentList, assignmentByCandidate, logs.

- [ ] **Step 5: Create `lib/mutations/assessment.mutations.ts`**

mutationOptions for: create/update/delete assessment, assign, update/delete assignment, create score. Invalidate relevant query keys.

- [ ] **Step 6: Create `routes/assessment.routes.tsx`**

```tsx
import { lazy } from 'react'

const AssessmentListPage = lazy(() => import('../pages/list-page'))
const AssessmentFormPage = lazy(() => import('../pages/form-page'))
const AssignAssessmentPage = lazy(() => import('../pages/assign-page'))
const AssignmentListPage = lazy(() => import('../pages/assignment-list-page'))

export const assessmentRoutes = [
  { path: '/dashboard/assessments', element: <AssessmentListPage /> },
  { path: '/dashboard/assessments/new', element: <AssessmentFormPage /> },
  { path: '/dashboard/assessments/edit/:id', element: <AssessmentFormPage /> },
  { path: '/dashboard/assessments/assign', element: <AssignAssessmentPage /> },
  { path: '/dashboard/assessments/assignments', element: <AssignmentListPage /> },
]
```

- [ ] **Step 7: Create pages**

Migrate from `src/pages/assessments/` replacing RTK Query hooks. No other logic changes.

- [ ] **Step 8: Commit**

```bash
git add -A && git commit -m "feat: add assessments module with API, queries, mutations, pages"
```

---

### Task 7: Offers Module

**Files:**
- Create: `client/src/modules/offers/types/offer.types.ts`
- Create: `client/src/modules/offers/schemas/offer.schema.ts`
- Create: `client/src/modules/offers/lib/api/offer.api.ts`
- Create: `client/src/modules/offers/lib/queries/offer.queries.ts`
- Create: `client/src/modules/offers/lib/mutations/offer.mutations.ts`
- Create: `client/src/modules/offers/routes/offer.routes.tsx`
- Create: `client/src/modules/offers/pages/list-page.tsx`
- Create: `client/src/modules/offers/pages/form-page.tsx`
- Create: `client/src/modules/offers/index.ts`

Same pattern as previous modules. Migrate from `src/pages/offers/` and `src/services/offerService.ts`.

- [ ] **Commit**

```bash
git add -A && git commit -m "feat: add offers module with API, queries, mutations, pages"
```

---

### Task 8: Emails Module

**Files:**
- Create: `client/src/modules/emails/types/email.types.ts`
- Create: `client/src/modules/emails/schemas/email.schema.ts`
- Create: `client/src/modules/emails/lib/api/email.api.ts`
- Create: `client/src/modules/emails/lib/queries/email.queries.ts`
- Create: `client/src/modules/emails/lib/mutations/email.mutations.ts`
- Create: `client/src/modules/emails/routes/email.routes.tsx`
- Create: `client/src/modules/emails/pages/list-page.tsx`
- Create: `client/src/modules/emails/pages/form-page.tsx`
- Create: `client/src/modules/emails/pages/general-email-page.tsx`
- Create: `client/src/modules/emails/index.ts`

Migrate from `src/pages/emails/` and `src/services/emailService.ts`.

- [ ] **Commit**

```bash
git add -A && git commit -m "feat: add emails module with API, queries, mutations, pages"
```

---

### Task 9: Dashboard Module

**Files:**
- Create: `client/src/modules/dashboard/types/dashboard.types.ts`
- Create: `client/src/modules/dashboard/lib/queries/dashboard.queries.ts`
- Create: `client/src/modules/dashboard/routes/dashboard.routes.tsx`
- Create: `client/src/modules/dashboard/pages/dashboard-page.tsx`
- Create: `client/src/modules/dashboard/components/CandidateByTechnology.tsx`
- Create: `client/src/modules/dashboard/components/CandidateLevelDistribution.tsx`
- Create: `client/src/modules/dashboard/components/HiredandRejectedCorelation.tsx`
- Create: `client/src/modules/dashboard/components/ListOfCandidatesWithStatus.tsx`
- Create: `client/src/modules/dashboard/components/MetricsCard.tsx`
- Create: `client/src/modules/dashboard/components/RecentActivitiesLog.tsx`
- Create: `client/src/modules/dashboard/components/UpComingInterviews.tsx`
- Create: `client/src/modules/dashboard/index.ts`

- [ ] **Step 1: Move dashboard components**

Dashboard charts are presentational — they already receive data via props. Move them to `modules/dashboard/components/` without changes.

- [ ] **Step 2: Create `pages/dashboard-page.tsx`**

Migrate from `src/pages/Dashboard.tsx`:
- Replace `useGetCandidateQuery({ searchText: '', status: '' })` → `useQuery(candidateListOptions({ searchText: '', status: '' }))`
- Replace `useGetActivityLogsQuery()` → use from shared or inline API call

- [ ] **Step 3: Create routes + barrel**

```tsx
export const dashboardRoutes = [
  { path: '/dashboard', element: <DashboardPage /> },
]
```

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: add dashboard module"
```

---

### Task 10: Landing Module

**Files:**
- Create: `client/src/modules/landing/pages/landing-page.tsx`
- Create: `client/src/modules/landing/components/Hero.tsx`
- Create: `client/src/modules/landing/components/Feature.tsx`
- Create: `client/src/modules/landing/components/Benefits.tsx`
- Create: `client/src/modules/landing/components/Testimonials.tsx`
- Create: `client/src/modules/landing/components/Footer.tsx`
- Create: `client/src/modules/landing/components/Header.tsx`
- Create: `client/src/modules/landing/components/LandingPageLayout.tsx`
- Create: `client/src/modules/landing/routes/landing.routes.tsx`
- Create: `client/src/modules/landing/index.ts`

All landing components are presentational — no API calls. Pure copy-move.

- [ ] **Commit**

```bash
git add -A && git commit -m "feat: add landing module"
```

---

### Task 11: Shared Components — Layout + Common

**Files:**
- Create: `client/src/shared/components/layout/Layout.tsx`
- Create: `client/src/shared/components/layout/Header.tsx`
- Create: `client/src/shared/components/layout/Sidebar.tsx`
- Create: `client/src/shared/components/layout/MobileSidebar.tsx`
- Create: `client/src/shared/components/ui/button/Primary.tsx`
- Create: `client/src/shared/components/ui/button/Secondary.tsx`
- Create: `client/src/shared/components/common/GlobalSearch.tsx`
- Create: `client/src/shared/components/common/ThemeToggle.tsx`
- Create: `client/src/shared/components/common/Logo.tsx`
- Create: `client/src/shared/components/common/ScrollToTop.tsx`
- Create: `client/src/shared/components/common/Table.tsx`
- Create: `client/src/shared/components/common/CandidateSearch.tsx`
- Create: `client/src/shared/components/common/Export.tsx`
- Create: `client/src/shared/components/common/Hero.tsx` (from component/common/)
- Create: `client/src/shared/components/Charts/BarGraph.tsx`
- Create: `client/src/shared/components/Charts/LineGraph.tsx`
- Create: `client/src/shared/components/Charts/PieChart.tsx`
- Create: `client/src/shared/pages/NotFound.tsx`

- [ ] **Step 1: Update Layout components to use Zustand**

`Layout.tsx` and `Header.tsx` currently use `useAppSelector(state => state.sideBar.collapsed)` and `useAppDispatch()`. Replace with `useSidebarStore()`:

```tsx
// Before
import { useAppSelector, useAppDispatch } from '@/Hooks/hook'

// After
import { useSidebarStore } from '@/shared/store/sidebar.store'
```

Same for theme — replace `useAppSelector(state => state.theme.mode)` with `useThemeStore()`.

- [ ] **Step 2: Move all component files**

Copy files from `src/component/` to `src/shared/components/`, updating imports where needed. No logic changes.

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: restructure shared components into shared/ modules"
```

---

### Task 12: Routes + App.tsx + main.tsx Update

**Files:**
- Modify: `client/src/routes/MainRoutes.tsx`
- Modify: `client/src/routes/Protected.tsx`
- Modify: `client/src/routes/Public.tsx`
- Modify: `client/src/App.tsx`
- Modify: `client/src/main.tsx`

- [ ] **Step 1: Update `MainRoutes.tsx`**

```tsx
import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router'
import Protected from './Protected'
import Public from './Public'
import { authRoutes } from '@/modules/auth'
import { landingRoutes } from '@/modules/landing'
import { dashboardRoutes } from '@/modules/dashboard'
import { candidateRoutes } from '@/modules/candidates'
import { interviewRoutes } from '@/modules/interviews'
import { assessmentRoutes } from '@/modules/assessments'
import { offerRoutes } from '@/modules/offers'
import { emailRoutes } from '@/modules/emails'

const NotFound = lazy(() => import('@/shared/components/common/NotFound'))

export default function MainRoutes() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {/* Public routes */}
          <Route element={<Public />}>
            {authRoutes.map((route, i) => (
              <Route key={i} path={route.path} element={route.element} />
            ))}
            {landingRoutes.map((route, i) => (
              <Route key={i} path={route.path} element={route.element} />
            ))}
          </Route>

          {/* Protected routes */}
          <Route element={<Protected />}>
            {dashboardRoutes.map((route, i) => (
              <Route key={i} path={route.path} element={route.element} />
            ))}
            {candidateRoutes.map((route, i) => (
              <Route key={i} path={route.path} element={route.element} />
            ))}
            {interviewRoutes.map((route, i) => (
              <Route key={i} path={route.path} element={route.element} />
            ))}
            {assessmentRoutes.map((route, i) => (
              <Route key={i} path={route.path} element={route.element} />
            ))}
            {offerRoutes.map((route, i) => (
              <Route key={i} path={route.path} element={route.element} />
            ))}
            {emailRoutes.map((route, i) => (
              <Route key={i} path={route.path} element={route.element} />
            ))}
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
```

- [ ] **Step 2: Update `Protected.tsx`**

Replace `useAppSelector(state => state.auth.user.token)` with `useAuth()`:

```tsx
import { Navigate, Outlet } from 'react-router'
import { useAuth } from '@/shared/hooks/useAuth'
import Layout from '@/shared/components/layout/Layout'

export default function Protected() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) return <div>Loading...</div>
  if (!isAuthenticated) return <Navigate to="/login" replace />

  return (
    <Layout>
      <Outlet />
    </Layout>
  )
}
```

- [ ] **Step 3: Update `App.tsx`**

Remove Redux dispatch references, use Zustand store:

```tsx
import MainRoutes from './routes/MainRoutes'
import { ConfigProvider, App as AntApp, theme } from 'antd'
import { useThemeStore } from '@/shared/store/theme.store'
import { useEffect } from 'react'

const App = () => {
  const { mode, setThemeMode } = useThemeStore()

  useEffect(() => {
    const savedTheme = localStorage.getItem('themeMode')
    if (savedTheme === 'light' || savedTheme === 'dark') {
      setThemeMode(savedTheme)
    }
  }, [setThemeMode])

  useEffect(() => {
    if (mode === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [mode])

  const antTheme = {
    token: {
      colorPrimary: '#1A365D',
      colorSuccess: '#52C41A',
      colorWarning: '#FAAD14',
      colorError: '#FF4D4F',
      colorInfo: '#1A365D',
      borderRadius: 6,
      colorText: mode === 'dark' ? '#fff' : '#1A365D',
      colorIcon: '#1A365D',
      colorBgContainer: mode === 'dark' ? '#0D1117' : '#fff',
    },
    components: {
      Button: { colorPrimaryHover: '#FF7A22' },
    },
    algorithm: mode === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
  }

  return (
    <ConfigProvider theme={antTheme}>
      <AntApp>
        <MainRoutes />
      </AntApp>
    </ConfigProvider>
  )
}

export default App
```

- [ ] **Step 4: Update `main.tsx`**

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { queryClient } from '@/shared/lib/query-client'
import { AuthProvider } from '@/shared/hooks/useAuth'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <App />
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>,
)
```

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: update routes, App.tsx, main.tsx for React Query + Zustand + AuthContext"
```

---

### Task 13: Delete Legacy Files

**Files to delete:**
- `client/src/store.ts`
- `client/src/Hooks/hook.ts`
- `client/src/services/` (entire directory)
- `client/src/slices/` (entire directory)
- `client/src/action/` (entire directory)

- [ ] **Step 1: Verify nothing imports from deleted files**

```bash
cd /home/rahul-adhikari/code/own-projects/HRFolio/client
grep -r "from.*store\.ts" --include="*.ts" --include="*.tsx" src/ | grep -v "node_modules" | grep -v "shared/store"
grep -r "from.*Hooks/hook" --include="*.ts" --include="*.tsx" src/
grep -r "from.*services/" --include="*.ts" --include="*.tsx" src/
grep -r "from.*slices/" --include="*.ts" --include="*.tsx" src/
grep -r "from.*action/" --include="*.ts" --include="*.tsx" src/
```

If any appear, update those imports to use the new module structure.

- [ ] **Step 2: Delete legacy directories**

```bash
rm -rf src/store.ts src/Hooks/hook.ts
rm -rf src/services src/slices src/action
```

- [ ] **Step 3: Remove @reduxjs/toolkit and react-redux from package.json**

```bash
npm uninstall @reduxjs/toolkit react-redux
```

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "chore: remove Redux (store, services, slices, actions) after migration"
```

---

### Task 14: Update api-conventions Rules + Run Lint + Build

**Files:**
- Modify: `.agents/rules/api-conventions.md`

- [ ] **Step 1: Update `.agents/rules/api-conventions.md`**

Replace the entire file to reflect the new architecture:

```markdown
---
paths:
  - "client/src/shared/lib/**"
  - "client/src/modules/*/lib/api/**"
  - "client/src/modules/*/lib/queries/**"
  - "client/src/modules/*/lib/mutations/**"
  - "server/src/controllers/**"
  - "server/src/routes/**"
  - "server/src/middleware/**"
---
# API Conventions

## Frontend — Data Fetching

### HTTP Layer (`shared/lib/axios.ts`)
- All HTTP calls use the exported `GET`, `POST`, `PUT`, `PATCH`, `DELETE` helpers
- Never use `fetch` or raw axios directly
- `ApiError` class normalizes all errors — catch with `error instanceof ApiError`
- Auth token attached via axios interceptor — never manually in individual API calls
- 401/403 response triggers automatic logout via interceptor

### Module API Files (`modules/<name>/lib/api/`)
- Raw async functions only — no React hooks, no UI logic
- Call the HTTP helpers directly
- Always typed with explicit `Promise<T>` return types
- Named exports — never grouped into objects

### Queries (`modules/<name>/lib/queries/`)
- Use `queryOptions()` from `@tanstack/react-query`
- Query keys structured as `['domain', 'subdomain', ...params]`
- Always reference query options `_def` or `.queryKey` for cache invalidation — never duplicate strings

### Mutations (`modules/<name>/lib/mutations/`)
- Use `mutationOptions()` from `@tanstack/react-query`
- Handle cache invalidation in `onSuccess` via `queryClient.invalidateQueries()`
- Named exports — never grouped into objects

### Consumption in Components
- Use `useQuery(options)` and `useMutation(options)` directly
- No wrapper hooks around single queries/mutations unless shared across 2+ components

## State Management

| State Type | Solution |
|---|---|
| Server state (API data) | TanStack React Query |
| Auth state | React Context (`useAuth()`) |
| UI state (theme, sidebar, search) | Zustand |
| Form state | Ant Design Form + Zod validation |
| URL state (filters, pagination) | URL params |

## Backend — Server

- Controllers call services / models — never put business logic in route handlers
- Route files define paths and attach middleware only
- All responses: `{ success: true, data: T }` or `{ success: false, message: string }`

## Form Validation

- Zod schemas in `modules/<name>/schemas/`
- Types inferred via `z.infer<typeof schema>` — never hand-rolled
- Default values exported separately from schema
- Validate with `schema.parse()` before submission
```

- [ ] **Step 2: Run lint**

```bash
cd /home/rahul-adhikari/code/own-projects/HRFolio/client && npm run lint
```

Fix any issues.

- [ ] **Step 3: Run build**

```bash
cd /home/rahul-adhikari/code/own-projects/HRFolio/client && npm run build
```

Fix any build errors.

- [ ] **Step 4: Run dev server to verify**

```bash
cd /home/rahul-adhikari/code/own-projects/HRFolio/client && npm run dev
```

Confirm the app starts without errors.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "docs: update api-conventions rules for React Query + Zustand + module structure"
```

---

## File Change Summary

| Action | Count | Description |
|---|---|---|
| Create | ~90 | Module files (pages, components, API, queries, mutations, types, schemas, routes, barrels) |
| Create | ~8 | Shared files (axios, query-client, auth context, zustand stores, constants) |
| Create | ~15 | Shared components (layout, common, charts) |
| Modify | 5 | Config (vite.config.ts, tsconfig.json, tsconfig.app.json, package.json, main.tsx) |
| Modify | 3 | Routes (MainRoutes.tsx, Protected.tsx, App.tsx) |
| Modify | 1 | Rules file (api-conventions.md) |
| Delete | ~25 | Legacy files (services/, slices/, action/, store.ts, Hooks/hook.ts) |
