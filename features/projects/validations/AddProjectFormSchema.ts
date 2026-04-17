import { z } from 'zod'

const AddProjectFormSchema = z.object({
  name: z.string().min(3, 'Project name must be at least 3 characters.'),
  description: z
    .string()
    .max(500, 'Max 500 characters')
    .optional()
    .or(z.literal('')),
})

type TAddProjectFormSchema = z.infer<typeof AddProjectFormSchema>

export { AddProjectFormSchema, type TAddProjectFormSchema }
