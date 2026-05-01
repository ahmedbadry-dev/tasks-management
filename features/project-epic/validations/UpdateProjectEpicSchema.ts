import { z } from 'zod'

// We validate "partial updates" because each field is saved independently.
const UpdateProjectEpicPatchSchema = z
  .object({
    // Title is required only when it is part of the patch payload.
    title: z.string().min(3, 'Epic title must be at least 3 characters.').optional(),

    // Description can be a string or null (null means remove description).
    description: z.string().max(500, 'Max 500 characters').nullable().optional(),

    // Assignee can be a valid UUID or null (null means unassigned).
    assignee_id: z.uuid().nullable().optional(),

    // Deadline can be YYYY-MM-DD or null (null means remove deadline).
    // If present as a date string, it must not be in the past.
    deadline: z
      .string()
      .nullable()
      .optional()
      .refine((val) => {
        if (val === undefined || val === null) return true
        return new Date(val) >= new Date(new Date().setHours(0, 0, 0, 0))
      }, 'Deadline must be today or in the future'),
  })
  // Reject empty patch payloads early.
  .refine((payload) => Object.keys(payload).length > 0, {
    message: 'No fields provided for update.',
  })

type TUpdateProjectEpicPatchSchema = z.infer<typeof UpdateProjectEpicPatchSchema>

export { UpdateProjectEpicPatchSchema, type TUpdateProjectEpicPatchSchema }
