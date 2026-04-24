import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  resetProjects,
  selectProjects,
  selectProjectsError,
  selectProjectsHasNextPage,
  selectProjectsIsFetchingPage,
  selectProjectsStatus,
} from '../store/projectsSlice'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  fetchNextProjects,
  fetchProjectsPage,
} from '../store/asyncThunk/projectsThunk'
import { useMediaQuery } from '../hooks/useMediaQuery'

export const useProjectList = (accessToken: string) => {
  const dispatch = useAppDispatch()
  const projects = useAppSelector(selectProjects)
  const hasNextPage = useAppSelector(selectProjectsHasNextPage)
  const status = useAppSelector(selectProjectsStatus)
  const isInitialLoading = status === 'loading' && projects.length === 0
  const isFetchingPage = useAppSelector(selectProjectsIsFetchingPage)
  const error = useAppSelector(selectProjectsError)
  const loadMoreRef = useRef<HTMLDivElement | null>(null) // this ref for the sentinel element to make the infinite scroll

  const { isDesktop, setIsDesktop } = useMediaQuery(accessToken)

  const hasProjects = projects.length > 0

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 640px)')
    const handleChange = () => setIsDesktop(mediaQuery.matches)

    handleChange()
    mediaQuery.addEventListener('change', handleChange)

    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const handleLoadMore = useCallback(() => {
    // if there is no next page => stop
    // if we have loading => stop
    // if we in desktop => stop
    if (isDesktop || !hasNextPage || isInitialLoading || isFetchingPage) return
    dispatch(fetchNextProjects({ accessToken }))
  }, [
    accessToken,
    dispatch,
    hasNextPage,
    isDesktop,
    isFetchingPage,
    isInitialLoading,
  ])

  useEffect(() => {
    if (isDesktop) return

    const target = loadMoreRef.current
    if (!target) return

    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0]
        // isIntersecting => true / if user enter the viewport
        if (!firstEntry?.isIntersecting) return // if sentinel => (target div) existing and user enter the viewport
        // we call load more get the next page if we have
        handleLoadMore()
      },
      { root: null, rootMargin: '200px 0px', threshold: 0.1 }
    )

    observer.observe(target) // start the observing

    return () => observer.disconnect()
  }, [handleLoadMore, isDesktop])

  return {
    projects,
    hasNextPage,
    isInitialLoading,
    isFetchingPage,
    error,
    loadMoreRef,
    isDesktop,
    hasProjects,
    setIsDesktop,
  }
}
