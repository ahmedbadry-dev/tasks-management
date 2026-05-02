'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

type UseDebouncedSearchOptions = {
  delay?: number
  initialValue?: string
}

export function useDebouncedSearch(
  onSearch: (term: string) => void,
  options?: UseDebouncedSearchOptions
) {
  const delay = options?.delay ?? 400
  const [inputValue, setInputValue] = useState(options?.initialValue ?? '')
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleChange = useCallback(
    (value: string) => {
      setInputValue(value)

      if (timerRef.current) clearTimeout(timerRef.current)

      // Delay API/filter calls while the user is typing to reduce noisy requests.
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
