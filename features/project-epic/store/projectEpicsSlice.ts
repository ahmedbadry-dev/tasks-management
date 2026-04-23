import { createSlice } from '@reduxjs/toolkit'
import { EpicsState } from '../types'

import { RootState } from '@/store'
import {
  fetchNextEpicsPage,
  fetchProjectEpicsPage,
} from './asyncThunk/epicThunk'
import { PROJECTS_PAGE_SIZE } from '@/features/projects/constants'

const initialState: EpicsState = {
  items: [],
  currentPage: 1,
  limit: PROJECTS_PAGE_SIZE,
  totalCount: 0,
  hasNextPage: false,
  isInitialLoading: false,
  isFetchingPage: false,
  error: null,
  activeRequestId: null, // we used it tp protect from stale responses
}

const projectEpicsSlice = createSlice({
  name: 'projectEpics',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjectEpicsPage.pending, (state, action) => {
        state.error = null
        state.activeRequestId = action.meta.requestId // save the id of this request
        state.isInitialLoading = state.items.length === 0
        state.isFetchingPage = state.items.length > 0
      })
      .addCase(fetchProjectEpicsPage.fulfilled, (state, action) => {
        if (state.activeRequestId !== action.meta.requestId) return // if this response is not for the last request ignore it

        const { data, totalCount, page } = action.payload
        state.items = data // her we replace the data we do not append on it
        state.currentPage = page
        state.totalCount = totalCount
        // page=1, limit=10, total=25 -> 10 < 25 -> true
        // page=3, limit=10, total=25 -> 30 < 25 -> false
        state.hasNextPage = page * state.limit < totalCount
        state.isInitialLoading = false
        state.isFetchingPage = false
        state.activeRequestId = null
      })
      .addCase(fetchProjectEpicsPage.rejected, (state, action) => {
        if (state.activeRequestId !== action.meta.requestId) return // ignore old errors

        state.isInitialLoading = false
        state.isFetchingPage = false
        state.activeRequestId = null
        state.error = (action.payload as string) ?? 'Failed to load projects'
      })
      // mobile
      .addCase(fetchNextEpicsPage.pending, (state, action) => {
        state.error = null
        state.activeRequestId = action.meta.requestId
        state.isFetchingPage = true
      })
      .addCase(fetchNextEpicsPage.fulfilled, (state, action) => {
        if (state.activeRequestId !== action.meta.requestId) return

        const { data, totalCount, page } = action.payload
        state.items = [...state.items, ...data] //append to state bot replace
        state.currentPage = page
        state.totalCount = totalCount
        state.hasNextPage = page * state.limit < totalCount
        state.isFetchingPage = false
        state.activeRequestId = null
      })
      .addCase(fetchNextEpicsPage.rejected, (state, action) => {
        if (state.activeRequestId !== action.meta.requestId) return

        state.isFetchingPage = false
        state.activeRequestId = null
        state.error = (action.payload as string) ?? 'Failed to load more epics'
      })
  },
})

export default projectEpicsSlice.reducer
export const selectEpicsItems = (state: RootState) => state.projectEpics.items
export const selectEpicsIsInitialLoading = (state: RootState) =>
  state.projectEpics.isInitialLoading
export const selectEpicsIsFetchingPage = (state: RootState) =>
  state.projectEpics.isFetchingPage
export const selectEpicsError = (state: RootState) => state.projectEpics.error
export const selectEpicsCurrentPage = (state: RootState) =>
  state.projectEpics.currentPage
export const selectEpicsTotalCount = (state: RootState) =>
  state.projectEpics.totalCount
export const selectEpicsLimit = (state: RootState) => state.projectEpics.limit
export const selectEpicsTotalPages = (state: RootState) =>
  Math.ceil(state.projectEpics.totalCount / state.projectEpics.limit)

export const selectEpicsHasNextPage = (state: RootState) =>
  state.projectEpics.hasNextPage
