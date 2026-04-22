import { createSlice } from '@reduxjs/toolkit'
import { EpicsState } from '../types'
import { fetchProjectEpics } from './asyncThunk/epicThunk'

const initialState: EpicsState = {
  items: [],
  isInitialLoading: false,
  error: null,
}

const projectEpicsSlice = createSlice({
  name: 'projectEpics',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjectEpics.pending, (state) => {
        state.isInitialLoading = true
        state.error = null
      })
      .addCase(fetchProjectEpics.fulfilled, (state, action) => {
        state.isInitialLoading = false
        state.items = action.payload
      })
      .addCase(fetchProjectEpics.rejected, (state, action) => {
        state.isInitialLoading = false
        state.error =
          action.payload ??
          action.error.message ??
          'Failed to load project epics'
      })
  },
})

export default projectEpicsSlice.reducer
