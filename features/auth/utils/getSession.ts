import { cookies } from 'next/headers'

export const getSession = async () => {
  const cookiesStore = await cookies()

  const user = cookiesStore.get('user')?.value

  if (!user) return null

  return JSON.parse(user)
}
