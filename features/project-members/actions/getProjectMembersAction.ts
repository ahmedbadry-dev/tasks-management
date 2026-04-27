import { getSession } from '@/features/auth/utils/getSession'
import { TProjectMember } from '../types'
import { redirect } from 'next/navigation'
import { projectMembersService } from '../services/projectMembersService'
import { parseError } from '@/utils/parseError'
import { routes } from '@/lib/routes'

type getProjectMembersActionResult =
  | { success: true; data: TProjectMember[] }
  | { success: false; error: string }

export const getProjectMembersAction = async (
  project_id: string
): Promise<getProjectMembersActionResult> => {
  const session = await getSession()
  if (!session) redirect(routes.auth.signIn)

  try {
    const response = await projectMembersService.getProjectMembers(
      project_id,
      session.accessToken
    )
    return { success: true, data: response }
  } catch (error) {
    return { success: false, error: parseError(error) }
  }
}
