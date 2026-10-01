// One error type for every failed request, so the UI can tell "not found" from "server down"
export class ApiError extends Error {
  status?: number

  constructor(message: string, status?: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export const isNotFound = (error: unknown) => error instanceof ApiError && error.status === 404
