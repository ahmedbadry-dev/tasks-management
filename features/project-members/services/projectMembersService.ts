import { env } from '@/lib/env'
import { TProjectMember } from '../types'
import { toSafeProjectId } from '@/features/projects/utils/toSafeProjectId'
import { parseApiError } from '@/utils/parseApiError'

export type InviteMemberRpcBody = {
  p_email: string
  p_project_id: string
  p_app_url: string
  p_base_url: string
}

export type AcceptInvitationRpcBody = {
  p_token: string
}

export const projectMembersService = {
  getProjectMembers: async (
    project_id: string,
    accessToken: string
  ): Promise<TProjectMember[]> => {
    const safeProjectId = toSafeProjectId(project_id)
    const response = await fetch(
      `${env.apiUrl}/rest/v1/get_project_members?project_id=eq.${safeProjectId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          apikey: env.anonKey,
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )

    if (!response.ok) throw await parseApiError(response)

    return await response.json()
  },
  inviteMember: async (
    body: InviteMemberRpcBody,
    accessToken: string
  ): Promise<void> => {
    const response = await fetch(`${env.apiUrl}/rest/v1/rpc/invite_member`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: env.anonKey,
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) throw await parseApiError(response)
  },
  acceptInvitation: async (
    body: AcceptInvitationRpcBody,
    accessToken: string
  ): Promise<unknown> => {
    const response = await fetch(`${env.apiUrl}/rest/v1/rpc/accept_invitation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: env.anonKey,
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) throw await parseApiError(response)

    const contentType = response.headers.get('content-type') || ''
    if (!contentType.includes('application/json')) return null

    return await response.json()
  },
}
