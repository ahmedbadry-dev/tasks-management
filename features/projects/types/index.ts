export type TProject = {
  id: string
  name: string
  description: string | null
  created_by: string
  created_at: string
}

export type TAddProjectBody = {
  name: string
  description: string | null
}

export type ProjectsState = {
  items: TProject[]
  currentPage: number
  totalCount: number
  limit: number
  hasNextPage: boolean
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  isFetchingPage: boolean
  error: string | null
  activeRequestId: string | null
}

export type PaginatedResponse<T> = {
  data: T[]
  totalCount: number
}

export type TUpdateProjectBody = {
  name: string
  description: string | null
}
