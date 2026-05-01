'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

export function useEpicsSearch(onSearch: (term: string) => void, delay = 400) {
  const [inputValue, setInputValue] = useState('')
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleChange = useCallback(
    (value: string) => {
      setInputValue(value)

      if (timerRef.current) clearTimeout(timerRef.current)

      timerRef.current = setTimeout(() => {
        onSearch(value.trim())
      }, delay)
    },
    [onSearch, delay]
  )

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  return { inputValue, handleChange }
}
