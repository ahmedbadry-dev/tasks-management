'use server'

import { ActionResult } from '@/shared/types/action-result'
import { getSession } from '@/features/auth/utils/getSession'
import { UUID_REGEX } from '@/features/projects/constants'
import { projectMembersService } from '../services/projectMembersService'
import { mapInvitationError } from '../utils/mapInvitationError'
import { AcceptInvitationSchema } from '../validations/AcceptInvitationSchema'

type AcceptInvitationActionInput = {
  token: string
}

type AcceptInvitationActionData = {
  projectId: string | null
}

const extractProjectId = (payload: unknown): string | null => {
  if (!payload) return null

  const record =
    Array.isArray(payload) && payload.length > 0 && typeof payload[0] === 'object'
      ? (payload[0] as Record<string, unknown>)
      : typeof payload === 'object'
        ? (payload as Record<string, unknown>)
        : null

  if (!record) return null

  const candidates = [
    record.project_id,
    record.projectId,
    record.p_project_id,
  ]

  const value = candidates.find((candidate) => typeof candidate === 'string')
  if (typeof value !== 'string') return null

  return UUID_REGEX.test(value) ? value : null
}

export const acceptInvitationAction = async (
  input: AcceptInvitationActionInput
): Promise<ActionResult<AcceptInvitationActionData>> => {
  const session = await getSession()
  if (!session) {
    return { ok: false, error: 'Please sign in to accept this invitation.' }
  }

  const parsed = AcceptInvitationSchema.safeParse(input)
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0]
    return {
      ok: false,
      error: firstIssue?.message ?? 'Invalid invitation token.',
    }
  }

  try {
    const response = await projectMembersService.acceptInvitation(
      { p_token: parsed.data.token },
      session.accessToken
    )

    return {
      ok: true,
      data: { projectId: extractProjectId(response) },
    }
  } catch (error) {
    return { ok: false, error: mapInvitationError(error, 'accept') }
  }
}

