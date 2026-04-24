'use client'

import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { closeModal, selectIsModalOpen, selectModalPayload, selectModalType } from '@/store/uiStore/uiSlice'
import { EpicsModel } from '@/features/project-epic/components/EpicsModel'
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

    return null
}
