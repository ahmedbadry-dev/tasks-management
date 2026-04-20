'use server'

import { getSession } from '@/features/auth/utils/getSession'
import { redirect } from 'next/navigation'
import { parseError } from '@/utils/parseError'
import { TAddProjectBody } from '../types'
import { projectService } from '../services/projectService'
import { UpdateProjectFormSchema } from '../validations/UpdateProjectFormSchema'

type UpdateProjectResult = { success: false; error: string } | void

export const updateProjectAction = async (
  project_id: string,
  body: TAddProjectBody
): Promise<UpdateProjectResult> => {
  const session = await getSession()
  if (!session) redirect('/sign-in')

  const schemaInput = {
    name: body.name,
    description: body.description ?? '',
  }

  const parsedBody = UpdateProjectFormSchema.safeParse(schemaInput)
  if (!parsedBody.success) {
    const firstIssue = parsedBody.error.issues[0]
    return {
      success: false,
      error: firstIssue?.message ?? 'Invalid project data',
    }
  }

  const normalizedBody: TAddProjectBody = {
    name: parsedBody.data.name,
    description: parsedBody.data.description || null,
  }

  try {
    await projectService.updateProject(
      project_id,
      normalizedBody,
      session.accessToken
    )
  } catch (error) {
    return { success: false, error: parseError(error) }
  }

  redirect('/project')
}
