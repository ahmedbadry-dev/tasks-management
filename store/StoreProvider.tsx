// store/StoreProvider.tsx
'use client'

import { useState } from 'react'
import { Provider } from 'react-redux'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { makeStore, AppStore } from './index'
import { setUser } from './userStore/userSlice'
import { AuthUser } from '@/features/auth/types'
import { createQueryClient } from '@/lib/queryClient'

type Props = {
    children: React.ReactNode
    user: AuthUser | null
}

export function StoreProvider({ children, user }: Props) {
    const [store] = useState<AppStore>(() => {
        const nextStore = makeStore()
        if (user) {
            nextStore.dispatch(setUser(user))
        }
        return nextStore
    })
    const [queryClient] = useState(createQueryClient)

    return (
        <Provider store={store}>
            <QueryClientProvider client={queryClient}>
                {children}
                {process.env.NODE_ENV === 'development' ? (
                    <ReactQueryDevtools initialIsOpen={false} />
                ) : null}
            </QueryClientProvider>
        </Provider>
    )
}
