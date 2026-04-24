import { createSlice } from '@reduxjs/toolkit'
import { EpicsState } from '../types'

import { RootState } from '@/store'
import {
  fetchEpicDetails,
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
  status: 'idle',
  isFetchingPage: false,
  error: null,
  activeRequestId: null, // we used it tp protect from stale responses

  detailsById: {},
  detailsStatusById: {},
  detailsErrorById: {},
  detailsRequestIdById: {},
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
        state.status = 'loading'
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
        state.status = 'succeeded'
        state.isFetchingPage = false
        state.activeRequestId = null
      })
      .addCase(fetchProjectEpicsPage.rejected, (state, action) => {
        if (state.activeRequestId !== action.meta.requestId) return // ignore old errors

        state.isFetchingPage = false
        state.activeRequestId = null
        state.status = 'failed'
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
        state.status = 'succeeded'
        state.isFetchingPage = false
        state.activeRequestId = null
      })
      .addCase(fetchNextEpicsPage.rejected, (state, action) => {
        if (state.activeRequestId !== action.meta.requestId) return

        state.isFetchingPage = false
        state.activeRequestId = null
        state.status = 'failed'
        state.error = (action.payload as string) ?? 'Failed to load more epics'
      })
      // epics details
      .addCase(fetchEpicDetails.pending, (state, action) => {
        const epic_id = action.meta.arg.epic_id
        state.detailsStatusById[epic_id] = 'loading'
        state.detailsErrorById[epic_id] = null
        state.detailsRequestIdById[epic_id] = action.meta.requestId
      })
      .addCase(fetchEpicDetails.fulfilled, (state, action) => {
        const { epic_id, data } = action.payload
        const reqId = state.detailsRequestIdById[epic_id]
        if (reqId !== action.meta.requestId) return

        state.detailsById[epic_id] = data
        state.detailsStatusById[epic_id] = 'succeeded'
        state.detailsRequestIdById[epic_id] = null
      })
      .addCase(fetchEpicDetails.rejected, (state, action) => {
        const epic_id = action.meta.arg.epic_id
        const reqId = state.detailsRequestIdById[epic_id]
        if (reqId !== action.meta.requestId) return

        state.detailsStatusById[epic_id] = 'failed'
        state.detailsErrorById[epic_id] =
          (action.payload as string) ?? 'Failed to load epic details'
        state.detailsRequestIdById[epic_id] = null
      })
  },
})

export default projectEpicsSlice.reducer
export const selectEpicsItems = (state: RootState) => state.projectEpics.items
export const selectEpicsStatus = (state: RootState) => state.projectEpics.status
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
export const selectEpicDetailsById = (
  state: RootState,
  epicId?: string | null
) => (epicId ? (state.projectEpics.detailsById[epicId] ?? null) : null)

export const selectEpicDetailsStatusById = (
  state: RootState,
  epicId?: string | null
) =>
  epicId ? (state.projectEpics.detailsStatusById[epicId] ?? 'idle') : 'idle'

export const selectEpicDetailsErrorById = (
  state: RootState,
  epicId?: string | null
) => (epicId ? (state.projectEpics.detailsErrorById[epicId] ?? null) : null)
