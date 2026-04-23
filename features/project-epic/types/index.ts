export type TUser = {
  sub: string
  name: string
  email: string
  department: string | null
}

export type TEpic = {
  id: string
  project_id: string
  title: string
  description: string
  created_at: string
  deadline: string
  epic_id: string
  created_by: TUser
  assignee: TUser | null
}

export type EpicsState = {
  items: TEpic[]
  currentPage: number
  totalCount: number
  limit: number
  hasNextPage: boolean
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  isFetchingPage: boolean
  error: string | null
  activeRequestId: string | null
}

export type TProjectEpicBody = {
  project_id: string
  title: string
  description?: string | null
  assignee_id?: string | null
  deadline?: string | null
}

export type TMember = {
  member_id: string
  project_id: string
  user_id: string
  role: string
  email: string
  metadata: {
    sub: string
    name: string
    email: string
    job_title: string
    email_verified: boolean
    phone_verified: boolean
  }
}
