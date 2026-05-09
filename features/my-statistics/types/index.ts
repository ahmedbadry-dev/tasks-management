export type TaskStatus =
  | 'TO_DO'
  | 'IN_PROGRESS'
  | 'BLOCKED'
  | 'IN_REVIEW'
  | 'READY_FOR_QA'
  | 'REOPENED'
  | 'READY_FOR_PRODUCTION'
  | 'DONE'

export type DateRange = {
  start: string
  end: string
}

export type DayStats = {
  day: string
  statuses: Partial<Record<TaskStatus, number>>
}

export type CalendarStatsResponse = {
  daily: DayStats[]
  totals: Partial<Record<TaskStatus, number>>
  total_tasks: number
  done_tasks: number
  overdue_tasks: number
}

export type CalendarStatsParams = {
  p_start_date: string
  p_end_date: string
  p_project_id: string | null
  p_status: TaskStatus | null
}

export type ProjectTaskCount = {
  project_id: string
  project_name: string
  tasks_count: number
}

export type StatisticsProject = {
  id: string
  name: string
}
