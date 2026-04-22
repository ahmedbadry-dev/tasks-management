import { createAsyncThunk } from '@reduxjs/toolkit'
import { parseError } from '@/utils/parseError'
// import { TEpic } from '../../types'
import { getProjectEpicsAction } from '../../actions/getProjectEpicsAction'
import { TEpic } from '../../types'

// export const addProjectEpic = createAsyncThunk(
//   'projectEpics/addProjectEpic',
//   async (body: TProjectEpicBody, { rejectWithValue, signal }) => {
//     try {
//       if (signal.aborted) {
//         return rejectWithValue('Request was cancelled')
//       }

//       const result = await addProjectEpicAction(body)
//       if (!result.success) {
//         return rejectWithValue(result.error)
//       }
//     } catch (error) {
//       return rejectWithValue(parseError(error))
//     }
//   }
// )

export const fetchProjectEpics = createAsyncThunk<
  TEpic[],
  string,
  { rejectValue: string }
>(
  'projectEpics/fetchProjectEpics',
  async (project_id: string, { rejectWithValue, signal }) => {
    try {
      if (signal.aborted) {
        return rejectWithValue('Request was cancelled')
      }

      const result = await getProjectEpicsAction(project_id, signal)
      if (!result.success) {
        return rejectWithValue(result.error)
      }

      return result.data
    } catch (error) {
      return rejectWithValue(parseError(error))
    }
  }
)
