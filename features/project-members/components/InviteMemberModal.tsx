'use client'

import { useEffect, useState } from 'react'
import { AddUserIcon, CloseIcon, MailIcon } from '@/shared/components/icons'
import { inviteMemberAction } from '../actions/inviteMemberAction'
import { toast } from 'sonner'
import { zodResolver } from '@hookform/resolvers/zod'
import { SubmitHandler, useForm } from 'react-hook-form'
import {
  InviteMemberFormSchema,
  TInviteMemberFormSchema,
} from '../validations/InviteMemberSchema'

type InviteMemberModalProps = {
  isOpen: boolean
  onClose: () => void
  projectId: string
  projectName?: string
}

export const InviteMemberModal = ({
  isOpen,
  onClose,
  projectId,
  projectName = 'Architectural Studio',
}: InviteMemberModalProps) => {
  const [feedback, setFeedback] = useState<string | null>(null)
  const [feedbackKind, setFeedbackKind] = useState<'success' | 'error'>('success')

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<TInviteMemberFormSchema>({
    resolver: zodResolver(InviteMemberFormSchema),
    defaultValues: {
      email: '',
    },
    mode: 'onBlur',
  })

  useEffect(() => {
    if (!isOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const closeModal = () => {
    setFeedback(null)
    setFeedbackKind('success')
    reset()
    onClose()
  }

  const handleSendInvitation: SubmitHandler<TInviteMemberFormSchema> = async (data) => {
    setFeedback(null)

    const result = await inviteMemberAction({
      email: data.email.trim(),
      projectId,
    })

    if (result.ok) {
      setFeedbackKind('success')
      setFeedback('Invitation sent successfully.')
      reset()
      toast.success('Invitation sent successfully.')
      return
    }

    setError('root', { message: result.error })
    setFeedbackKind('error')
    setFeedback(result.error)
    toast.error(result.error)
  }

  return (
    <div
      className="fixed inset-0 z-90 flex items-end justify-center bg-slate-900/45 p-0 md:items-center md:p-4"
      onClick={closeModal}
      role="dialog"
      aria-modal="true"
      aria-label="Invite Team Member"
    >
      <div
        className="w-full rounded-t-3xl bg-white px-6 pb-7 pt-6 shadow-xl md:max-w-md md:rounded-xl md:px-8 md:pb-6 md:pt-5"
        onClick={(event) => event.stopPropagation()}
        role="document"
      >
        <div className="mb-5 flex items-start justify-between">
          <div className="space-y-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-surface-highest text-primary">
              <AddUserIcon size={17} />
            </span>
            <div>
              <p className="type-label-sm mb-2">Project Name</p>
              <h2 className="heading-3">Invite Team Member</h2>
              <p className="type-body-md max-w-[260px] text-[12px] leading-5">
                Send an invitation to join the {projectName} workspace.
              </p>
            </div>
          </div>

          <button
            type="button"
            className="cursor-pointer p-1.5 text-slate-600 hover:text-slate-900"
            onClick={closeModal}
            aria-label="Close invite modal"
          >
            <CloseIcon size={12} />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleSendInvitation)}>
          <div className="field">
            <label htmlFor="invite-member-email" className="field-label">
              Email Address
            </label>
            <div className="relative mt-1">
              <input
                id="invite-member-email"
                type="email"
                placeholder="Enter email address"
                className={`field-input w-full pr-10 ${errors.email ? 'is-invalid' : ''}`}
                aria-invalid={errors.email ? 'true' : 'false'}
                {...register('email')}
              />
              <MailIcon
                size={14}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
            </div>
            {errors.email?.message && (
              <p role="alert" className="field-error mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {errors.root?.message && (
            <p role="alert" className="mt-3 text-[12px] font-medium text-error">
              {errors.root.message}
            </p>
          )}

          {feedback && (
            <p
              className={`mt-3 text-[12px] font-medium ${feedbackKind === 'success' ? 'text-text-green' : 'text-error'}`}
              role={feedbackKind === 'error' ? 'alert' : undefined}
            >
              {feedback}
            </p>
          )}

          <div className="mt-7 flex flex-col-reverse gap-2 md:flex-row md:items-center md:justify-end">
            <button
              type="button"
              onClick={closeModal}
              className="btn btn-ghost w-full cursor-pointer md:w-auto"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary w-full cursor-pointer md:w-[150px]"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send Invitation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
