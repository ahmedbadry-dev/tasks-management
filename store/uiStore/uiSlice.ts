import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '@/store'
import { OpenModalPayload, UiModalState } from '@/types/modal'

const initialState: UiModalState = {
  isOpen: false,
  modalType: null,
  payload: null,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openModal: (state, action: PayloadAction<OpenModalPayload>) => {
      state.isOpen = true
      state.modalType = action.payload.modalType
      state.payload = action.payload.payload
    },
    closeModal: (state) => {
      state.isOpen = false
      state.modalType = null
      state.payload = null
    },
  },
})

export const { openModal, closeModal } = uiSlice.actions
export const selectIsModalOpen = (state: RootState) => state.ui.isOpen
export const selectModalType = (state: RootState) => state.ui.modalType
export const selectModalPayload = (state: RootState) => state.ui.payload
export default uiSlice.reducer
