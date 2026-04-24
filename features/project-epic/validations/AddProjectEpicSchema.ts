import { z } from 'zod'

const AddProjectEpicSchema = z.object({
  title: z.string().min(3, 'Epic title must be at least 3 characters.'),
  description: z
    .string()
    .max(500, 'Max 500 characters')
    .optional()
    .or(z.literal('')),
  assignee_id: z.uuid().optional().or(z.literal('')),
  deadline: z
    .string()
    .optional()
    .or(z.literal(''))
    .refine((val) => {
      if (!val) return true
      return new Date(val) >= new Date(new Date().setHours(0, 0, 0, 0))
    }, 'Deadline must be today or in the future'),
})

type TAddProjectEpicSchema = z.infer<typeof AddProjectEpicSchema>

export { AddProjectEpicSchema, type TAddProjectEpicSchema }
