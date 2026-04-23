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
  }
)
