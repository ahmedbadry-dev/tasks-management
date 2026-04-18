// store/StoreProvider.tsx
'use client'

import { useRef } from 'react'
import { Provider } from 'react-redux'
import { makeStore, AppStore } from './index'
import { setUser } from './slices/userSlice'
import { AuthUser } from '@/features/auth/types'

type Props = {
    children: React.ReactNode
    user: AuthUser | null
}

export function StoreProvider({ children, user }: Props) {
    const storeRef = useRef<AppStore | null>(null)

    if (!storeRef.current) {
        storeRef.current = makeStore()
        if (user) {
            storeRef.current.dispatch(setUser(user))
        }
    }

    return (
        <Provider store={storeRef.current}>
            {children}
        </Provider>
    )
}