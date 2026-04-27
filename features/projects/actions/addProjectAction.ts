'use server'

import { getSession } from '@/features/auth/utils/getSession'
import { redirect } from 'next/navigation'
import { parseError } from '@/utils/parseError'
import { TAddProjectBody } from '../types'
import { projectService } from '../services/projectService'
import { AddProjectFormSchema } from '../validations/AddProjectFormSchema'
import { ActionResult } from '@/shared/types/action-result'
import { routes } from '@/lib/routes'

export const addProjectAction = async (
  body: TAddProjectBody
): Promise<ActionResult> => {
  const session = await getSession()
  if (!session) redirect(routes.auth.signIn)

  const schemaInput = {
    name: body.name,
    description: body.description ?? '',
  }

  const parsedBody = AddProjectFormSchema.safeParse(schemaInput)
  if (!parsedBody.success) {
    const firstIssue = parsedBody.error.issues[0]
    return {
      ok: false,
      error: firstIssue?.message ?? 'Invalid project data',
    }
  }

  const normalizedBody: TAddProjectBody = {
    name: parsedBody.data.name,
    description: parsedBody.data.description || null,
  }

  try {
    await projectService.addProject(normalizedBody, session.accessToken)
  } catch (error) {
    return { ok: false, error: parseError(error) }
  }

  return { ok: true }
}
