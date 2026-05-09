'use client'

import { AllProjectsList } from './AllProjectsList'
import { MobileFiltersBar } from './MobileFiltersBar'
import { MobileKpiCards } from './MobileKpiCards'
import { MobileWeeklyCalendar } from './MobileWeeklyCalendar'
import { TasksByStatusChart } from './TasksByStatusChart'
import type {
  CalendarStatsResponse,
  DateRange,
  ProjectTaskCount,
  StatisticsProject,
  TaskStatus,
} from '../types'

type MobileStatisticsViewProps = {
  dateRange: DateRange
  projectId: string | null
  statusFilter: TaskStatus | null
  dateError: string | null
  projects: StatisticsProject[]
  isProjectsLoading: boolean
  projectsError: string | null
  calendarStats: CalendarStatsResponse | null
  projectCounts: ProjectTaskCount[]
  isLoading: boolean
  isCalendarLoading: boolean
  isProjectCountsLoading: boolean
  error: string | null
  onDateRangeChange: (range: DateRange) => void
  onProjectChange: (id: string | null) => void
  onStatusChange: (status: TaskStatus | null) => void
  onRetryProjects: () => void
}

export const MobileStatisticsView = ({
  dateRange,
  projectId,
  statusFilter,
  dateError,
  projects,
  isProjectsLoading,
  projectsError,
  calendarStats,
  projectCounts,
  isLoading,
  isCalendarLoading,
  isProjectCountsLoading,
  error,
  onDateRangeChange,
  onProjectChange,
  onStatusChange,
  onRetryProjects,
}: MobileStatisticsViewProps) => {
  const showEmptyFallback = !calendarStats && !isLoading && !error

  return (
    <div className="flex flex-col gap-8 pb-24">
      <MobileFiltersBar
        dateRange={dateRange}
        projectId={projectId}
        statusFilter={statusFilter}
        dateError={dateError}
        projects={projects}
        isProjectsLoading={isProjectsLoading}
        projectsError={projectsError}
        onDateRangeChange={onDateRangeChange}
        onProjectChange={onProjectChange}
        onStatusChange={onStatusChange}
        onRetryProjects={onRetryProjects}
      />

      {error && <p className="field-error">{error}</p>}

      {showEmptyFallback ? (
        <p className="type-body-md rounded-lg bg-white py-10 text-center text-slate-400">
          No data available for the selected range.
        </p>
      ) : (
        <>
          <MobileKpiCards
            total_tasks={calendarStats?.total_tasks ?? 0}
            done_tasks={calendarStats?.done_tasks ?? 0}
            overdue_tasks={calendarStats?.overdue_tasks ?? 0}
            isLoading={isCalendarLoading}
          />

          <MobileWeeklyCalendar
            daily={calendarStats?.daily ?? []}
            dateRange={dateRange}
            isLoading={isCalendarLoading}
          />

          <section className="flex flex-col gap-5">
            <h2 className="heading-3 font-bold">Task Statistics</h2>
            <TasksByStatusChart
              totals={calendarStats?.totals ?? {}}
              isLoading={isCalendarLoading}
              variant="mobile"
            />
            <AllProjectsList
              projects={projectCounts}
              isLoading={isProjectCountsLoading}
            />
          </section>
        </>
      )}
    </div>
  )
}
