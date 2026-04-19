import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AuthUser } from '@/features/auth/types'
import { RootState } from '..'

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

export const selectUser = (state: RootState) => state.user.data
export const selectUserMetadata = (state: RootState) =>
  state.user.data?.user_metadata
export const selectUserId = (state: RootState) => state.user.data?.id

export const { setUser, clearUser } = userSlice.actions
export default userSlice.reducer
