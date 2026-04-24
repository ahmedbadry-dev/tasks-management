import { env } from '@/lib/env'
import { TProjectMember } from '../types'
import { toSafeProjectId } from '@/features/projects/utils/toSafeProjectId'
import { parseApiError } from '@/utils/parseApiError'

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
}
