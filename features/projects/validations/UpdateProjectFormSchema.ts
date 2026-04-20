import { z } from 'zod'

const UpdateProjectFormSchema = z.object({
  name: z.string().min(3, 'Project name must be at least 3 characters.'),
  description: z
    .string()
    .max(500, 'Max 500 characters')
    .optional()
    .or(z.literal('')),
})

type TUpdateProjectFormSchema = z.infer<typeof UpdateProjectFormSchema>

export { UpdateProjectFormSchema, type TUpdateProjectFormSchema }
