'use client'

import { TASK_STATUSES, formatStatusLabel } from '../constants'
import type { DateRange, StatisticsProject, TaskStatus } from '../types'
import { DateRangePicker } from './DateRangePicker'
import {
  StatisticsSelect,
  type StatisticsSelectOption,
} from './StatisticsSelect'

type MobileFiltersBarProps = {
  dateRange: DateRange
  projectId: string | null
  statusFilter: TaskStatus | null
  dateError: string | null
  projects: StatisticsProject[]
  isProjectsLoading: boolean
  projectsError: string | null
  onDateRangeChange: (range: DateRange) => void
  onProjectChange: (id: string | null) => void
  onStatusChange: (status: TaskStatus | null) => void
  onRetryProjects: () => void
}

export const MobileFiltersBar = ({
  dateRange,
  projectId,
  statusFilter,
  dateError,
  projects,
  isProjectsLoading,
  projectsError,
  onDateRangeChange,
  onProjectChange,
  onStatusChange,
  onRetryProjects,
}: MobileFiltersBarProps) => {
  const projectOptions: StatisticsSelectOption[] = [
    { value: '', label: 'All Active Projects' },
    ...projects.map((project) => ({
      value: project.id,
      label: project.name,
    })),
  ]
  const selectedProjectOption =
    projectOptions.find((option) => option.value === (projectId ?? '')) ??
    projectOptions[0]

  const statusOptions: StatisticsSelectOption[] = [
    { value: '', label: 'All Status' },
    ...TASK_STATUSES.map((status) => ({
      value: status,
      label: formatStatusLabel(status),
    })),
  ]
  const selectedStatusOption =
    statusOptions.find((option) => option.value === (statusFilter ?? '')) ??
    statusOptions[0]

  if (projectsError) {
    return (
      <section className="flex flex-col gap-3">
        <div className="flex gap-2">
          <div className="min-w-0 flex-1">
            <StatisticsSelect
              inputId="mobile-statistics-project"
              options={[{ value: '', label: 'Failed to load' }]}
              value={{ value: '', label: 'Failed to load' }}
              isDisabled
              onChange={() => undefined}
            />
          </div>
          <button
            type="button"
            className="btn btn-secondary h-11 px-3"
            onClick={onRetryProjects}
          >
            Retry
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <StatisticsSelect
            inputId="mobile-statistics-status"
            options={statusOptions}
            value={selectedStatusOption}
            onChange={(option) =>
              onStatusChange(option?.value ? (option.value as TaskStatus) : null)
            }
          />
          <DateRangePicker
            value={dateRange}
            error={dateError}
            variant="field"
            onChange={onDateRangeChange}
          />
        </div>
      </section>
    )
  }

  return (
    <section className="flex flex-col gap-3">
      <StatisticsSelect
        inputId="mobile-statistics-project"
        options={projectOptions}
        value={selectedProjectOption}
        isLoading={isProjectsLoading}
        isDisabled={isProjectsLoading}
        onChange={(option) => onProjectChange(option?.value ? option.value : null)}
      />

      <div className="grid grid-cols-2 gap-3">
        <StatisticsSelect
          inputId="mobile-statistics-status"
          options={statusOptions}
          value={selectedStatusOption}
          onChange={(option) =>
            onStatusChange(option?.value ? (option.value as TaskStatus) : null)
          }
        />
        <DateRangePicker
          value={dateRange}
          error={dateError}
          variant="field"
          onChange={onDateRangeChange}
        />
      </div>
    </section>
  )
}
