import { z } from 'zod'

const statusEnum = z.enum([
  'TO_DO',
  'IN_PROGRESS',
  'BLOCKED',
  'IN_REVIEW',
  'READY_FOR_QA',
  'REOPENED',
  'READY_FOR_PRODUCTION',
  'DONE',
])

export const addTaskSchema = z.object({
  project_id: z.string().min(1),
  title: z.string().min(1, 'Title is required'),
  epic_id: z.string().optional(),
  description: z.string().optional(),
  assignee_id: z.string().optional(),
  due_date: z.string().optional(),
  status: statusEnum,
})

export type TAddTaskSchema = z.infer<typeof addTaskSchema>
