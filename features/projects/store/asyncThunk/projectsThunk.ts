import { createAsyncThunk } from '@reduxjs/toolkit'
import { projectService } from '../../services/projectService'
import { RootState } from '@/store'

type fetchProjectsPageArgs = { accessToken: string; page: number }

export const fetchProjectsPage = createAsyncThunk(
  'projects/fetchProjectsPage',
  async (
    { accessToken, page }: fetchProjectsPageArgs,
    { rejectWithValue, signal }
  ) => {
    try {
      const { data, totalCount } = await projectService.getProjects(
        accessToken,
        page,
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

// for mobile
export const fetchNextProjects = createAsyncThunk(
  'projects/fetchNextProjects',
  async (
    { accessToken }: { accessToken: string },
    { getState, rejectWithValue, signal }
  ) => {
    try {
      const state = getState() as RootState
      const nextPage = state.projects.currentPage + 1
      const { data, totalCount } = await projectService.getProjects(
        accessToken,
        nextPage,
        signal
      )

      return { data, totalCount, page: nextPage }
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to load more projects'
      )
    }
  },
  // this condition is firing before the thunk
  // what it doing prevent duplicate requests if i have a request
  // prevent request if i do not have next page
  {
    condition: (_, { getState }) => {
      const state = getState() as RootState

      if (state.projects.status === 'loading' || state.projects.isFetchingPage) {
        return false
      }

      return state.projects.hasNextPage
    },
  }
)
