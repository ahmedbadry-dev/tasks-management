import { configureStore } from '@reduxjs/toolkit'
import userReducer from './slices/userSlice'
import uiReducer from './slices/uiSlice'

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
