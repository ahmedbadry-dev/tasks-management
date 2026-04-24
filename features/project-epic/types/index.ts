export type RequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed'

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
export type TEpicDetails = TEpic

export type EpicsState = {
  items: TEpic[]
  currentPage: number
  totalCount: number
  limit: number
  hasNextPage: boolean
  status: RequestStatus
  isFetchingPage: boolean
  error: string | null
  activeRequestId: string | null

  detailsById: Record<string, TEpicDetails>
  detailsStatusById: Record<string, RequestStatus>
  detailsErrorById: Record<string, string | null>
  detailsRequestIdById: Record<string, string | null>
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
