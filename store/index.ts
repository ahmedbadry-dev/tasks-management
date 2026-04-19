import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userStore/userSlice'
import uiReducer from './uiStore/uiSlice'

export const makeStore = () =>
  configureStore({
    reducer: {
      user: userReducer,
      ui: uiReducer,
    },
  })

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
