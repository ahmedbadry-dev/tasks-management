import { createSlice } from '@reduxjs/toolkit'
import { ProjectsState } from '../types'
import {
  fetchNextProjects,
  fetchProjectsPage,
} from './asyncThunk/projectsThunk'
import { RootState } from '@/store'
import { PROJECTS_PAGE_SIZE } from '../constants'

const initialState: ProjectsState = {
  items: [],
  currentPage: 1,
  limit: PROJECTS_PAGE_SIZE,
  totalCount: 0,
  hasNextPage: false,
  status: 'idle',
  isFetchingPage: false,
  error: null,
  activeRequestId: null, // we used it tp protect from stale responses
}

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    resetProjects: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjectsPage.pending, (state, action) => {
        state.error = null
        state.activeRequestId = action.meta.requestId // save the id of this request
        state.status = 'loading'
        state.isFetchingPage = state.items.length > 0
      })
      .addCase(fetchProjectsPage.fulfilled, (state, action) => {
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
      .addCase(fetchProjectsPage.rejected, (state, action) => {
        if (state.activeRequestId !== action.meta.requestId) return // ignore old errors

        state.isFetchingPage = false
        state.activeRequestId = null
        state.status = 'failed'
        state.error = (action.payload as string) ?? 'Failed to load projects'
      })
      .addCase(fetchNextProjects.pending, (state, action) => {
        state.error = null
        state.activeRequestId = action.meta.requestId
        state.isFetchingPage = true
      })
      .addCase(fetchNextProjects.fulfilled, (state, action) => {
        if (state.activeRequestId !== action.meta.requestId) return

        const { data, totalCount, page } = action.payload
        const existingIds = new Set(state.items.map((project) => project.id))
        const uniqueIncoming = data.filter(
          (project) => !existingIds.has(project.id)
        ) // remove duplication

        state.items = [...state.items, ...uniqueIncoming] // add the new project to the old project (appending)
        state.currentPage = page
        state.totalCount = totalCount
        state.hasNextPage = page * state.limit < totalCount
        state.status = 'succeeded'
        state.isFetchingPage = false
        state.activeRequestId = null
      })
      .addCase(fetchNextProjects.rejected, (state, action) => {
        if (state.activeRequestId !== action.meta.requestId) return

        state.isFetchingPage = false
        state.activeRequestId = null
        state.status = 'failed'
        state.error =
          (action.payload as string) ?? 'Failed to load more projects'
      })
  },
})

export const { resetProjects } = projectsSlice.actions
export const selectProjects = (state: RootState) => state.projects.items
export const selectProjectsError = (state: RootState) => state.projects.error
export const selectProjectsStatus = (state: RootState) => state.projects.status
export const selectProjectsIsFetchingPage = (state: RootState) =>
  state.projects.isFetchingPage
export const selectProjectsCurrentPage = (state: RootState) =>
  state.projects.currentPage
export const selectProjectsTotalCount = (state: RootState) =>
  state.projects.totalCount
export const selectProjectsLimit = (state: RootState) => state.projects.limit
export const selectProjectsTotalPages = (state: RootState) =>
  Math.ceil(state.projects.totalCount / state.projects.limit)
export const selectProjectsHasNextPage = (state: RootState) =>
  state.projects.hasNextPage

export default projectsSlice.reducer
