export type ModalType = 'EPIC_DETAILS' | 'TASK_DETAILS' | 'CONFIRM_DELETE'

type ModalPayloadMap = {
  EPIC_DETAILS: { epicId: string; projectId: string }
  TASK_DETAILS: { taskId: string }
  CONFIRM_DELETE: { entity: 'epic' | 'task'; id: string }
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
