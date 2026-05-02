'use client'

import { useDebouncedSearch } from '@/shared/hooks/useDebouncedSearch'

export function useEpicsSearch(onSearch: (term: string) => void, delay = 400) {
  // Keep this thin wrapper for backward compatibility while we migrate callers
  // away from feature-to-feature imports into shared hooks.
  return useDebouncedSearch(onSearch, { delay })
}
