import { QueryClient } from '@tanstack/react-query'
import { ApiError } from '@/api/errors'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Retrying a 404 or other 4xx is pointless; network and 5xx errors get two retries
      retry: (failureCount, error) =>
        !(error instanceof ApiError && error.status && error.status < 500) && failureCount < 2,
      // Cached data counts as fresh for 5 minutes, so moving between pages doesn't refetch
      // (and so an edited product isn't replaced by DummyJSON's unedited copy)
      staleTime: 5 * 60_000,
      refetchOnWindowFocus: false,
    },
  },
})
