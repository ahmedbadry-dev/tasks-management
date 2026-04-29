import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '@/store'

export type EpicAssigneePatch = {
  id: string | null
  name: string
}

export type EpicUiPatch = {
  title?: string
  description?: string | null
  deadline?: string | null
  assignee?: EpicAssigneePatch
}

type ProjectEpicPatchesState = {
  byEpicId: Record<string, EpicUiPatch>
}

const initialState: ProjectEpicPatchesState = {
  byEpicId: {},
}

const projectEpicPatchesSlice = createSlice({
  name: 'projectEpicPatches',
  initialState,
  reducers: {
    upsertEpicPatch: (
      state,
      action: PayloadAction<{ epicId: string; patch: EpicUiPatch }>
    ) => {
      const { epicId, patch } = action.payload
      state.byEpicId[epicId] = {
        ...state.byEpicId[epicId],
        ...patch,
      }
    },
    clearEpicPatch: (state, action: PayloadAction<string>) => {
      delete state.byEpicId[action.payload]
    },
    clearAllEpicPatches: (state) => {
      state.byEpicId = {}
    },
  },
})

export const { upsertEpicPatch, clearEpicPatch, clearAllEpicPatches } =
  projectEpicPatchesSlice.actions

export const selectEpicPatchesById = (state: RootState) =>
  state.projectEpicPatches.byEpicId

export default projectEpicPatchesSlice.reducer
