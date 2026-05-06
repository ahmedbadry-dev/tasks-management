'use server'

import { headers } from 'next/headers'
import { env } from '@/lib/env'
import { ActionResult } from '@/shared/types/action-result'
import { getSession } from '@/features/auth/utils/getSession'
import { projectMembersService } from '../services/projectMembersService'
import { InviteMemberSchema } from '../validations/InviteMemberSchema'
import { mapInvitationError } from '../utils/mapInvitationError'

type InviteMemberActionInput = {
  email: string
  projectId: string
}

const toAppUrl = async () => {
  const configuredUrl = process.env.NEXT_PUBLIC_APP_URL?.trim()
  if (configuredUrl) return configuredUrl

  const requestHeaders = await headers()
  const host = requestHeaders.get('x-forwarded-host') ?? requestHeaders.get('host')
  const proto = requestHeaders.get('x-forwarded-proto') ?? 'http'

  return host ? `${proto}://${host}` : 'http://localhost:3000'
}

export const inviteMemberAction = async (
  input: InviteMemberActionInput
): Promise<ActionResult> => {
  const session = await getSession()
  if (!session) {
    return { ok: false, error: 'Please sign in to invite members.' }
  }

  const parsed = InviteMemberSchema.safeParse(input)
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0]
    return {
      ok: false,
      error: firstIssue?.message ?? 'Invalid invitation data.',
    }
  }

  try {
    const appUrl = await toAppUrl()

    await projectMembersService.inviteMember(
      {
        p_email: parsed.data.email,
        p_project_id: parsed.data.projectId,
        p_app_url: appUrl,
        p_base_url: env.apiUrl,
      },
      session.accessToken
    )
  } catch (error) {
    return { ok: false, error: mapInvitationError(error, 'invite') }
  }

  return { ok: true }
}

