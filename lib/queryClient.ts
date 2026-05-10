import { QueryClient } from '@tanstack/react-query'

export const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 2,
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  })
