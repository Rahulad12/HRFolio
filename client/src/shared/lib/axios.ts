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

const client = axios.create({
  baseURL: API_BASE_URL + '/api/',
  withCredentials: true,
})

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

let isRefreshing = false
let refreshQueue: Array<(token: string) => void> = []

function onRefreshSuccess(token: string) {
  refreshQueue.forEach((cb) => cb(token))
  refreshQueue = []
}

client.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as typeof error.config & { _retry?: boolean }

    if (error.response?.status === 401 && !original?._retry) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          refreshQueue.push((token) => {
            if (original) {
              original.headers = original.headers ?? {}
              original.headers.Authorization = `Bearer ${token}`
              resolve(client(original))
            }
          })
        })
      }

      original._retry = true
      isRefreshing = true

      try {
        const { data } = await axios.post(
          `${API_BASE_URL}/api/auth/refresh`,
          {},
          { withCredentials: true }
        )
        const newToken: string = data.token
        localStorage.setItem('token', newToken)
        onRefreshSuccess(newToken)
        if (original) {
          original.headers = original.headers ?? {}
          original.headers.Authorization = `Bearer ${newToken}`
          return client(original)
        }
      } catch {
        localStorage.removeItem('token')
        window.location.href = '/login'
        return Promise.reject(error)
      } finally {
        isRefreshing = false
      }
    }

    const data = error.response?.data as Record<string, unknown> | undefined
    throw new ApiError(
      error.response?.status || 500,
      (data?.message as string) || error.message || 'Unknown error',
      data?.errors as Record<string, string[]> | undefined,
    )
  }
)

export async function GET<T>(url: string, params?: Record<string, unknown>): Promise<T> {
  const { data } = await client.get<T>(url, { params })
  return data
}

export async function POST<T>(url: string, body?: unknown): Promise<T> {
  const { data } = await client.post<T>(url, body)
  return data
}

export async function PUT<T>(url: string, body?: unknown): Promise<T> {
  const { data } = await client.put<T>(url, body)
  return data
}

export async function PATCH<T>(url: string, body?: unknown): Promise<T> {
  const { data } = await client.patch<T>(url, body)
  return data
}

export async function DELETE<T>(url: string): Promise<T> {
  const { data } = await client.delete<T>(url)
  return data
}
