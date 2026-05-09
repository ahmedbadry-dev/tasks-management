'use client'

import { useCallback, useEffect, useState } from 'react'
import { getStatisticsProjectsAction } from '../actions/getStatisticsProjectsAction'
import type { StatisticsProject } from '../types'

export function useStatisticsProjects() {
  const [projects, setProjects] = useState<StatisticsProject[]>([])
  const [isProjectsLoading, setIsProjectsLoading] = useState(true)
  const [projectsError, setProjectsError] = useState<string | null>(null)

  const fetchProjects = useCallback(async () => {
    setIsProjectsLoading(true)
    setProjectsError(null)

    const result = await getStatisticsProjectsAction()

    if (result.success) {
      setProjects(result.data)
    } else {
      setProjectsError(result.error)
    }

    setIsProjectsLoading(false)
  }, [])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchProjects()
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [fetchProjects])

  return {
    projects,
    isProjectsLoading,
    projectsError,
    retryProjects: fetchProjects,
  }
}
