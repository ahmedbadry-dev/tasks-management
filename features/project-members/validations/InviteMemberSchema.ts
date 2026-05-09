import { z } from 'zod'
import { UUID_REGEX } from '@/features/projects/constants'

export const InviteMemberSchema = z.object({
  email: z
    .email('Please provide a valid email address')
    .min(1, 'Email is required'),
  projectId: z.string().regex(UUID_REGEX, 'Invalid project id'),
})

export type TInviteMemberSchema = z.infer<typeof InviteMemberSchema>

export const InviteMemberFormSchema = InviteMemberSchema.pick({
  email: true,
})

export type TInviteMemberFormSchema = z.infer<typeof InviteMemberFormSchema>
