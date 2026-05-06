'use client'

import { useState } from 'react'
import { Logo } from '@/shared/components/Logo'
import { acceptInvitationAction } from '../actions/acceptInvitationAction'
import { useRouter } from 'next/navigation'
import { routes } from '@/lib/routes'
import { toast } from 'sonner'

type AcceptInvitationViewProps = {
  token: string | null
}

export const AcceptInvitationView = ({ token }: AcceptInvitationViewProps) => {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [messageKind, setMessageKind] = useState<'success' | 'error'>('success')

  const onAcceptInvitation = async () => {
    if (isSubmitting) return
    if (!token) {
      setMessageKind('error')
      setMessage('This invitation link is invalid.')
      return
    }

    setIsSubmitting(true)
    setMessage(null)

    const result = await acceptInvitationAction({ token })
    setIsSubmitting(false)

    if (!result.ok) {
      setMessageKind('error')
      setMessage(result.error)
      toast.error(result.error)
      return
    }

    setMessageKind('success')
    setMessage('Invitation accepted successfully. Redirecting...')
    toast.success('Invitation accepted successfully.')

    const projectId = result.data?.projectId
    const destination = projectId
      ? routes.project.tasks(projectId)
      : routes.project.list

    router.push(destination)
  }

  return (
    <section className="flex min-h-dvh items-center justify-center bg-[#f2f3ff] px-4">
      <div className="w-full max-w-160">
        <div className="mb-10 flex items-center justify-center">
          <Logo />
        </div>

        <div className="overflow-hidden rounded-lg bg-white shadow-[0px_14px_28px_0px_rgba(0,0,0,0.08)]">
          <div className="h-1 w-full bg-primary-container" />
          <div className="px-5 py-10 text-center">
            <span className="type-label-sm rounded-full bg-surface-highest px-3 py-1 text-primary">
              New Project Invitation
            </span>

            <h1 className="mt-5 text-[34px] font-semibold leading-tight tracking-[-0.02em] text-slate-900">
              You&apos;ve been invited to join new project
            </h1>

            {token && (
              <p className="mt-3 text-[12px] text-slate-400">
                Invitation token: <span className="font-semibold">{token.slice(0, 8)}...</span>
              </p>
            )}

            {message && (
              <p
                className={`mt-3 text-[12px] font-medium ${messageKind === 'success' ? 'text-text-green' : 'text-error'}`}
                role={messageKind === 'error' ? 'alert' : undefined}
              >
                {message}
              </p>
            )}

            <button
              type="button"
              onClick={onAcceptInvitation}
              disabled={isSubmitting}
              className="btn btn-primary mt-7 w-full max-w-90 cursor-pointer"
            >
              {isSubmitting ? 'Accepting...' : 'Accept Invitation'}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
