'use server'

import { getSession } from '@/features/auth/utils/getSession'
import { projectEpicsService } from '../services/projectEpicsService'
import { TProjectEpicBody } from '../types'
import { redirect } from 'next/navigation'
import { parseError } from '@/utils/parseError'

type AddProjectEpicResult =
  | { success: true }
  | { success: false; error: string }

export const addProjectEpicAction = async (
  data: TProjectEpicBody
): Promise<AddProjectEpicResult> => {
  const session = await getSession()
  if (!session) redirect('/sign-up')

  try {
    await projectEpicsService.addProjectEpic(data, session.accessToken)
    return { success: true }
  } catch (error) {
    return { success: false, error: parseError(error) }
  }
}
