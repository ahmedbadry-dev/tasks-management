'use client'

import { useEffect, useRef } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'

const FLASH_TOASTS = {
    login_success: { type: 'success', message: 'Logged in successfully.' },
    register_success: { type: 'success', message: 'Account created successfully.' },
    project_created: { type: 'success', message: 'Project created successfully.' },
    project_updated: { type: 'success', message: 'Project updated successfully.' },
} as const

type FlashToastKey = keyof typeof FLASH_TOASTS

function isFlashToastKey(value: string): value is FlashToastKey {
    return value in FLASH_TOASTS
}

export function FlashToastFromQuery() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const handledRef = useRef<string>('')

    useEffect(() => {
        const ft = searchParams.get('ft')
        if (!ft || !isFlashToastKey(ft)) return

        const uniqueKey = `${pathname}?${searchParams.toString()}`
        if (handledRef.current === uniqueKey) return
        handledRef.current = uniqueKey

        const currentToast = FLASH_TOASTS[ft]
        if (currentToast.type === 'success') toast.success(currentToast.message)
        else toast.error(currentToast.message)

        const nextParams = new URLSearchParams(searchParams.toString())
        nextParams.delete('ft')

        const nextUrl = nextParams.toString()
            ? `${pathname}?${nextParams.toString()}`
            : pathname

        router.replace(nextUrl, { scroll: false })
    }, [pathname, router, searchParams])

    return null
}
