'use client'

import { MainContentHeader } from '@/shared/components/MainContentHeader'
import { AddUserIcon } from '@/shared/components/icons'
import { useAppDispatch } from '@/store/hooks'
import { openModal } from '@/store/uiStore/uiSlice'

type ProjectMembersHeaderProps = {
  projectId: string
  projectName?: string
}

export const ProjectMembersHeader = ({
  projectId,
  projectName = 'Architectural Studio',
}: ProjectMembersHeaderProps) => {
  const dispatch = useAppDispatch()

  const onInviteMemberClick = () => {
    dispatch(
      openModal({
        modalType: 'INVITE_MEMBER',
        payload: { projectId, projectName },
      })
    )
  }

  return (
    <MainContentHeader
      title="Project Members"
      btnIcon={<AddUserIcon size={18} />}
      btnText="Invite Member"
      onButtonClick={onInviteMemberClick}
      buttonAriaLabel="Invite member"
    />
  )
}
