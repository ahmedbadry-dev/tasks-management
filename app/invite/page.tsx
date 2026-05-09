import { AcceptInvitationView } from '@/features/project-members/components/AcceptInvitationView'
import { getSession } from '@/features/auth/utils/getSession'
import { routes } from '@/lib/routes'
import { redirect } from 'next/navigation'

type InvitePageProps = {
  searchParams: Promise<{ token?: string | string[] }>
}

export default async function InvitePage({ searchParams }: InvitePageProps) {
  const session = await getSession()
  const resolvedSearchParams = await searchParams
  const tokenValue = resolvedSearchParams.token
  const token = typeof tokenValue === 'string' ? tokenValue : null

  if (!session) {
    const inviteUrl = token
      ? `${routes.invite}?token=${encodeURIComponent(token)}`
      : routes.invite

    redirect(`${routes.auth.signIn}?redirectTo=${encodeURIComponent(inviteUrl)}`)
  }

  return <AcceptInvitationView token={token} />
}
