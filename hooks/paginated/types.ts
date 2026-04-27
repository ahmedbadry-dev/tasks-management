export type PaginatedResponse<T> = {
  data: T[]
  totalCount: number
}

export type PaginatedFetchStatus = 'idle' | 'loading' | 'succeeded' | 'failed'

export type FetchMode = 'replace' | 'append'

export type PaginatedFetchFn<T> = (
  page: number,
  signal: AbortSignal
) => Promise<PaginatedResponse<T>>
