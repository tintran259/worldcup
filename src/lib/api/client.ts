import type { ApiError } from '@/types/api.types'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? '/api'

class ApiClientError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string
  ) {
    super(message)
    this.name = 'ApiClientError'
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${BASE_URL}${path}`

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
    ...init,
  })

  if (!response.ok) {
    let errorBody: ApiError = {
      message: response.statusText,
      code: 'UNKNOWN_ERROR',
      status: response.status,
    }

    try {
      errorBody = await response.json()
    } catch {
      // use defaults
    }

    throw new ApiClientError(errorBody.status, errorBody.code, errorBody.message)
  }

  return response.json() as Promise<T>
}

export const apiClient = {
  get: <T>(path: string, init?: Omit<RequestInit, 'method'>) =>
    request<T>(path, { ...init, method: 'GET' }),

  post: <T>(path: string, body: unknown, init?: Omit<RequestInit, 'method' | 'body'>) =>
    request<T>(path, { ...init, method: 'POST', body: JSON.stringify(body) }),
}
