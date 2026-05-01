import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userStore/userSlice'
import uiReducer from './uiStore/uiSlice'
import projectEpicPatchesReducer from './projectEpicPatchesStore/projectEpicPatchesSlice'

export const makeStore = () =>
  configureStore({
    reducer: {
      user: userReducer,
      ui: uiReducer,
      projectEpicPatches: projectEpicPatchesReducer,
    },
  })

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
