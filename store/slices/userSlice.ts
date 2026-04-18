// store/slices/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AuthUser } from '@/features/auth/types'

type UserState = {
  data: AuthUser | null
}

const initialState: UserState = { data: null }

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<AuthUser>) => {
      state.data = action.payload
    },
    clearUser: (state) => {
      state.data = null
    },
  },
})

export const { setUser, clearUser } = userSlice.actions
export default userSlice.reducer
