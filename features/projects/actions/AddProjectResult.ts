'use server'

import { getSession } from '@/features/auth/utils/getSession'
import { redirect } from 'next/navigation'
import { parseError } from '@/utils/parseError'
import { TAddProjectBody } from '../types'
import { projectService } from '../services/projectService'

type AddProjectResult = { success: false; error: string } | void

export const addProjectAction = async (
  body: TAddProjectBody
): Promise<AddProjectResult> => {
  const session = await getSession()
  if (!session) redirect('/sign-in')

  try {
    await projectService.addProject(body, session.accessToken)
  } catch (error) {
    return { success: false, error: parseError(error) }
  }

  redirect('/project')
}
