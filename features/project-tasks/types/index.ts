export type TAddTaskBody = {
  project_id: string
  title: string
  status: string
  epic_id?: string | null
  description?: string | null
  assignee_id?: string | null
  due_date?: string | null
}

export type TUpdateTaskPatch = Partial<{
  title: string
  description: string | null
  assignee_id: string | null
  due_date: string | null
  epic_id: string | null
  status: string
}>

export type TTaskAssignee = {
  id: string
  name: string
  email: string
  department: string | null
  avatar?: string | null
  avatar_url?: string | null
}

export type TTaskEpic = {
  id: string
  title: string
  epic_id: string
}

export type TTask = {
  id: string
  project_id: string
  epic_id: string | null
  title: string
  description: string | null
  status: string
  created_at: string
  due_date: string | null
  assignee_name?: string | null
  assignee_avatar?: string | null
  task_id: string
  epic: TTaskEpic | null
  created_by: TTaskAssignee
  assignee: TTaskAssignee | null
}
