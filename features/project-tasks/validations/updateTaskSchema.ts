import { z } from 'zod'
import { TASK_STATUS_VALUES } from '../constants'

const optionalNullableString = z.string().nullable().optional()

export const updateTaskPatchSchema = z
  .object({
    title: z.string().trim().min(1, 'Title is required').optional(),
    description: optionalNullableString,
    assignee_id: optionalNullableString,
    due_date: optionalNullableString.refine((value) => {
      if (!value) return true

      const parsedDate = new Date(value)
      if (Number.isNaN(parsedDate.getTime())) return false

      const today = new Date()
      today.setHours(0, 0, 0, 0)

      return parsedDate >= today
    }, 'Due date must be today or in the future'),
    epic_id: optionalNullableString,
    status: z.enum(TASK_STATUS_VALUES).optional(),
  })
  .refine((patch) => Object.values(patch).some((value) => value !== undefined), {
    message: 'No task fields were provided',
  })

export type TUpdateTaskPatchSchema = z.infer<typeof updateTaskPatchSchema>
