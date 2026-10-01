import axios from 'axios'
import { ApiError } from './errors'

export const client = axios.create({
  baseURL: 'https://dummyjson.com',
  timeout: 10_000, // a slow network fails after 10s instead of hanging forever
})

client.interceptors.response.use(undefined, (error: unknown) => {
  // Cancelled requests (a newer search replaced them) are not real errors
  if (axios.isCancel(error)) throw error

  if (axios.isAxiosError<{ message?: string }>(error)) {
    throw new ApiError(error.response?.data?.message ?? error.message, error.response?.status)
  }
  throw error
})
