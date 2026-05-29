export interface ApiResponse<T> {
  data: T
  meta?: {
    total?: number
    page?: number
    perPage?: number
  }
}

export interface ApiError {
  message: string
  code: string
  status: number
}
