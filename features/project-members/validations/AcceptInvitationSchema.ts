import { z } from 'zod'

export const AcceptInvitationSchema = z.object({
  token: z
    .string()
    .trim()
    .min(1, 'Invitation token is required')
    .max(2048, 'Invalid invitation token'),
})

export type TAcceptInvitationSchema = z.infer<typeof AcceptInvitationSchema>
