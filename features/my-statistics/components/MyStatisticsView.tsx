'use client'

import { AllProjectsList } from './AllProjectsList'
import { FiltersBar } from './FiltersBar'
import { KpiCards } from './KpiCards'
import { MobileStatisticsView } from './MobileStatisticsView'
import { TasksByStatusChart } from './TasksByStatusChart'
import { WeeklyCalendar } from './WeeklyCalendar'
import { useMyStatistics } from '../hooks/useMyStatistics'
import { useStatisticsProjects } from '../hooks/useStatisticsProjects'
import { useStatisticsFilters } from '../hooks/useStatisticsFilters'

export const MyStatisticsView = () => {
  const {
    dateRange,
    projectId,
    statusFilter,
    dateError,
    setDateRange,
    setProjectId,
    setStatusFilter,
  } = useStatisticsFilters()

  const {
    calendarStats,
    projectCounts,
    isLoading,
    isCalendarLoading,
    isProjectCountsLoading,
    error,
  } = useMyStatistics(dateRange, projectId, statusFilter)

  const {
    projects,
    isProjectsLoading,
    projectsError,
    retryProjects,
  } = useStatisticsProjects()

  const showEmptyFallback = !calendarStats && !isLoading && !error

  return (
    <>
      <div className="md:hidden">
        <MobileStatisticsView
          dateRange={dateRange}
          projectId={projectId}
          statusFilter={statusFilter}
          dateError={dateError}
          projects={projects}
          isProjectsLoading={isProjectsLoading}
          projectsError={projectsError}
          calendarStats={calendarStats}
          projectCounts={projectCounts}
          isLoading={isLoading}
          isCalendarLoading={isCalendarLoading}
          isProjectCountsLoading={isProjectCountsLoading}
          error={error}
          onDateRangeChange={setDateRange}
          onProjectChange={setProjectId}
          onStatusChange={setStatusFilter}
          onRetryProjects={retryProjects}
        />
      </div>

      <div className="hidden min-h-0 flex-col gap-6 md:flex">
        <header className="p-2">
          <h1 className="heading-1">My Statistics</h1>
          <p className="type-body-md">
            Manage your deadlines and track team velocity.
          </p>
        </header>

        <FiltersBar
          dateRange={dateRange}
          projectId={projectId}
          statusFilter={statusFilter}
          dateError={dateError}
          projects={projects}
          isProjectsLoading={isProjectsLoading}
          projectsError={projectsError}
          onDateRangeChange={setDateRange}
          onProjectChange={setProjectId}
          onStatusChange={setStatusFilter}
          onRetryProjects={retryProjects}
        />

        {error && <p className="field-error">{error}</p>}

        {showEmptyFallback ? (
          <p className="type-body-md rounded-lg bg-white py-10 text-center text-slate-400">
            No data available for the selected range.
          </p>
        ) : (
          <>
            <KpiCards
              total_tasks={calendarStats?.total_tasks ?? 0}
              done_tasks={calendarStats?.done_tasks ?? 0}
              overdue_tasks={calendarStats?.overdue_tasks ?? 0}
              isLoading={isCalendarLoading}
            />

            <WeeklyCalendar
              daily={calendarStats?.daily ?? []}
              dateRange={dateRange}
              isLoading={isCalendarLoading}
            />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <TasksByStatusChart
                totals={calendarStats?.totals ?? {}}
                isLoading={isCalendarLoading}
              />
              <AllProjectsList
                projects={projectCounts}
                isLoading={isProjectCountsLoading}
              />
            </div>
          </>
        )}
      </div>
    </>
  )
}
