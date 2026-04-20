import { UUID_REGEX } from '../constants'

export const toSafeProjectId = (projectId: string) => {
  if (!UUID_REGEX.test(projectId)) {
    throw new Error('Invalid project id')
  }
  return encodeURIComponent(projectId)
}
