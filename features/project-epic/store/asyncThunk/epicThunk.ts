import { createAsyncThunk } from '@reduxjs/toolkit'
import { parseError } from '@/utils/parseError'
import { TEpic } from '../../types'
import { projectEpicsService } from '../../services/projectEpicsService'
import { RootState } from '@/store'

type fetchProjectsPageArgs = {
  accessToken: string
  page: number
  project_id: string
}

type FetchEpicDetailsArgs = {
  accessToken: string
  epic_id: string
  project_id: string
  force?: boolean
}

export const fetchProjectEpicsPage = createAsyncThunk(
  'epics/fetchProjectEpicsPage',
  async (
    { accessToken, page, project_id }: fetchProjectsPageArgs,
    { rejectWithValue, signal }
  ) => {
    try {
      const { data, totalCount } = await projectEpicsService.getProjectEpics(
        accessToken,
        page,
        project_id,
        signal
      )
      return { data, totalCount, page }
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to load projects'
      )
    }
  }
)

export const fetchNextEpicsPage = createAsyncThunk(
  'epics/fetchNextEpicsPage',
  async (
    { accessToken, project_id }: Omit<fetchProjectsPageArgs, 'page'>,
    { rejectWithValue, signal, getState }
  ) => {
    try {
      const state = getState() as RootState
      const nextPage = state.projectEpics.currentPage + 1

      const { data, totalCount } = await projectEpicsService.getProjectEpics(
        accessToken,
        nextPage,
        project_id,
        signal
      )
      return { data, totalCount, page: nextPage }
    } catch (error) {
      return rejectWithValue(parseError(error))
    }
  }, // this condition is firing before the thunk
  // what it doing prevent duplicate requests if i have a request
  // prevent request if i do not have next page
  {
    condition: (_, { getState }) => {
      const state = getState() as RootState

      if (
        state.projectEpics.status === 'loading' ||
        state.projectEpics.isFetchingPage
      ) {
        return false
      }

      return state.projectEpics.hasNextPage
    },
  }
)

export const fetchEpicDetails = createAsyncThunk(
  'epics/fetchEpicDetails',
  async (
    { accessToken, epic_id, project_id }: FetchEpicDetailsArgs,
    { rejectWithValue, signal }
  ) => {
    try {
      const data = await projectEpicsService.getEpicDetails(
        accessToken,
        epic_id,
        project_id,
        signal
      )
      return { epic_id, data }
    } catch (error) {
      return rejectWithValue(parseError(error))
    }
  },
  {
    condition: ({ epic_id, force = false }, { getState }) => {
      if (force) return true
      const state = getState() as RootState
      const status = state.projectEpics.detailsStatusById[epic_id]
      const hasCachedData = Boolean(state.projectEpics.detailsById[epic_id])

      if (status === 'loading') return false
      if (hasCachedData) return false
      return true
    },
  }
)
