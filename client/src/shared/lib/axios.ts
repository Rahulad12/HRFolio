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
