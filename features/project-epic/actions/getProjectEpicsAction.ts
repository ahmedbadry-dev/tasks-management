// 'use server'

// import { getSession } from '@/features/auth/utils/getSession'
// import { projectEpicsService } from '../services/projectEpicsService'
// import { TEpic } from '../types'
// import { redirect } from 'next/navigation'
// import { parseError } from '@/utils/parseError'

// type GetProjectEpicsActionResult =
//   | { success: true; data: TEpic[] }
//   | { success: false; error: string }

// export const getProjectEpicsAction = async (
//   project_id: string
// ): Promise<GetProjectEpicsActionResult> => {
//   const session = await getSession()
//   if (!session) redirect('/sign-up')

//   try {
//     const response = await projectEpicsService.getProjectEpics(
//       project_id,
//       session.accessToken
//     )
//     return { success: true, data: response }
//   } catch (error) {
//     return { success: false, error: parseError(error) }
//   }
// }
