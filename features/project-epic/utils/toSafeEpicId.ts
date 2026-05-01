import { UUID_REGEX } from '@/features/projects/constants'

export const toSafeEpicId = (epicId: string) => {
  if (!UUID_REGEX.test(epicId)) {
    throw new Error('Invalid epic id')
  }
  return encodeURIComponent(epicId)
}
