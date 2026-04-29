'use client'

import { useCallback, useEffect, useId, useState } from 'react'
import { EpicsModelSkeleton } from './EpicsModelSkeleton'
import { useEpicDetails } from '../hooks/useEpicDetails'
import { projectEpicsService } from '../services/projectEpicsService'
import { RequestStatus, TMember } from '../types'
import { EpicsModelDetails } from './EpicsModelDetails'
import { EpicsModelHeader } from './EpicsModelHeader'

type Props = {
  isOpen: boolean
  epicId: string | null
  projectId: string | null
  accessToken: string
  onClose: () => void
}

export const EpicsModel = ({
  isOpen,
  epicId,
  projectId,
  accessToken,
  onClose,
}: Props) => {
  const dialogTitleId = useId()

  // Project members are loaded on demand from the details component
  // when the assignee field enters edit mode.
  const [members, setMembers] = useState<TMember[]>([])
  const [membersStatus, setMembersStatus] = useState<RequestStatus>('idle')
  const [membersError, setMembersError] = useState<string | null>(null)
  const [membersProjectId, setMembersProjectId] = useState<string | null>(null)

  const {
    epicDetails,
    status: epicDetailsStatus,
    error: epicDetailsError,
    isInitialLoading,
    hasInitialError,
    isRefreshing,
    retry,
  } = useEpicDetails({
    isOpen,
    epicId,
    projectId,
    accessToken,
  })

  const selectedEpic = epicDetails
  const epicCode = selectedEpic?.epic_id ?? '-'
  const epicTitle = selectedEpic?.title ?? 'Epic Details'
  const mobileEpicTitle = selectedEpic?.title ?? 'Epic Details'

  const loadMembers = useCallback(async () => {
    if (!projectId) return

    // Cache members per project to avoid repeated network calls
    // every time the assignee editor opens.
    if (membersProjectId === projectId && members.length > 0) return

    setMembersStatus('loading')
    setMembersError(null)

    try {
      const data = await projectEpicsService.getProjectMembers(projectId, accessToken)
      setMembers(data)
      setMembersProjectId(projectId)
      setMembersStatus('succeeded')
    } catch (error) {
      setMembersStatus('failed')
      setMembersError(error instanceof Error ? error.message : 'Failed to load members.')
    }
  }, [accessToken, members.length, membersProjectId, projectId])

  useEffect(() => {
    if (!isOpen) return

    // Freeze page scroll while modal is open.
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-90 flex items-center justify-center bg-slate-900/40 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby={dialogTitleId}
    >
      <div
        className="modal-scroll-hidden max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-5 shadow-xl"
        onClick={(event) => event.stopPropagation()}
        role="document"
      >
        <EpicsModelHeader
          dialogTitleId={dialogTitleId}
          epicCode={epicCode}
          epicTitle={epicTitle}
          mobileEpicTitle={mobileEpicTitle}
          onClose={onClose}
        />

        <div className="flex flex-col gap-5">
          {isInitialLoading && <EpicsModelSkeleton />}

          {hasInitialError && (
            <div className="rounded-lg border border-error/20 bg-error-container/60 p-4">
              <p className="mb-3 type-body-md text-error">
                {epicDetailsError ?? 'Failed to load epic details.'}
              </p>
              <button type="button" onClick={retry} className="btn btn-primary px-4 py-2">
                Retry
              </button>
            </div>
          )}

          {!isInitialLoading && !hasInitialError && selectedEpic && (
            <EpicsModelDetails
              key={selectedEpic.id}
              selectedEpic={selectedEpic}
              detailsStatus={epicDetailsStatus}
              detailsError={epicDetailsError}
              isRefreshing={isRefreshing}
              onRetry={retry}
              members={members}
              membersStatus={membersStatus}
              membersError={membersError}
              onLoadMembers={loadMembers}
            />
          )}
        </div>
      </div>
    </div>
  )
}
