import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userStore/userSlice'
// import uiReducer from './uiStore/uiSlice'
import projectsReducer from '@/features/projects/store/projectsSlice'

export const makeStore = () =>
  configureStore({
    reducer: {
      user: userReducer,
      // ui: uiReducer,
      projects: projectsReducer,
    },
  })

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
