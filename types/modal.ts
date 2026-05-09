export type ModalType = 'EPIC_DETAILS' | 'TASK_DETAILS' | 'CONFIRM_DELETE' | 'INVITE_MEMBER'

type ModalPayloadMap = {
  EPIC_DETAILS: { epicId: string; projectId: string }
  TASK_DETAILS: { taskId: string; projectId: string }
  CONFIRM_DELETE: { entity: 'epic' | 'task'; id: string }
  INVITE_MEMBER: { projectId: string; projectName?: string }
}

export type OpenModalPayload<T extends ModalType = ModalType> = {
  modalType: T
  payload: ModalPayloadMap[T]
}

export type UiModalState = {
  isOpen: boolean
  modalType: ModalType | null
  payload: ModalPayloadMap[ModalType] | null
}
