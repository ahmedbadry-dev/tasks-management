'use client'

import { useEffect, useState } from 'react'

export function useDesktopBreakpoint(desktopBreakpoint: number): boolean | null {
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null)

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(min-width: ${desktopBreakpoint}px)`)

    const handleChange = (event: MediaQueryListEvent | MediaQueryList) => {
      setIsDesktop(event.matches)
    }

    handleChange(mediaQuery)
    mediaQuery.addEventListener(
      'change',
      handleChange as (event: MediaQueryListEvent) => void
    )

    return () => {
      mediaQuery.removeEventListener(
        'change',
        handleChange as (event: MediaQueryListEvent) => void
      )
    }
  }, [desktopBreakpoint])

  return isDesktop
}
