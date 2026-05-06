'use client'

import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { closeModal, selectIsModalOpen, selectModalPayload, selectModalType } from '@/store/uiStore/uiSlice'
import { EpicsModel } from '@/features/project-epic/components/EpicsModel'
import { TaskDetailsModal } from '@/features/project-tasks/components/TaskDetailsModal'
import { InviteMemberModal } from '@/features/project-members/components/InviteMemberModal'
// import { TaskDetailsModal } from ...

type Props = {
    accessToken: string
}

export const ModalHost = ({ accessToken }: Props) => {
    const dispatch = useAppDispatch()
    const isOpen = useAppSelector(selectIsModalOpen)
    const modalType = useAppSelector(selectModalType)
    const payload = useAppSelector(selectModalPayload)

    const onClose = () => dispatch(closeModal())
    if (!isOpen || !modalType) return null

    if (modalType === 'EPIC_DETAILS') {
        const epicPayload = payload as { epicId: string; projectId: string } | null
        if (!epicPayload) return null

        return (
            <EpicsModel
                isOpen
                epicId={epicPayload.epicId}
                projectId={epicPayload.projectId}
                accessToken={accessToken}
                onClose={onClose}
            />
        )
    }

    if (modalType === 'TASK_DETAILS') {
        const taskPayload = payload as { taskId: string; projectId: string } | null
        if (!taskPayload) return null

        return (
            <TaskDetailsModal
                isOpen
                taskId={taskPayload.taskId}
                projectId={taskPayload.projectId}
                onClose={onClose}
            />
        )
    }

    if (modalType === 'INVITE_MEMBER') {
        const invitePayload = payload as { projectId: string; projectName?: string } | null
        if (!invitePayload?.projectId) return null

        return (
            <InviteMemberModal
                isOpen={isOpen}
                onClose={onClose}
                projectId={invitePayload.projectId}
                projectName={invitePayload?.projectName}
            />
        )
    }

    return null
}
