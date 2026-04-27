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

export type PaginatedResponse<T> = {
  data: T[]
  totalCount: number
}

export type TUpdateProjectBody = {
  name: string
  description: string | null
}
