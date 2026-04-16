import { authService } from '../services/authService'
import { getSession } from './getSession'

export const getUserData = async () => {
  const session = await getSession()
  if (!session) return null

  try {
    return await authService.userinfo(session.accessToken)
  } catch {
    return null
  }
}
