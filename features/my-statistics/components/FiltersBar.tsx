import { TASK_STATUSES, formatStatusLabel } from '../constants'
import type { DateRange, StatisticsProject, TaskStatus } from '../types'
import { DateRangePicker } from './DateRangePicker'
import {
  StatisticsSelect,
  type StatisticsSelectOption,
} from './StatisticsSelect'

type FiltersBarProps = {
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

export const FiltersBar = ({
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
}: FiltersBarProps) => {
  const projectOptions: StatisticsSelectOption[] = [
    { value: '', label: 'All Projects' },
    ...projects.map((project) => ({
      value: project.id,
      label: project.name,
    })),
  ]
  const selectedProjectOption =
    projectOptions.find((option) => option.value === (projectId ?? '')) ??
    projectOptions[0]

  const statusOptions: StatisticsSelectOption[] = [
    { value: '', label: 'All Statuses' },
    ...TASK_STATUSES.map((status) => ({
      value: status,
      label: formatStatusLabel(status),
    })),
  ]
  const selectedStatusOption =
    statusOptions.find((option) => option.value === (statusFilter ?? '')) ??
    statusOptions[0]

  return (
    <section className="rounded-lg bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <DateRangePicker
            value={dateRange}
            error={dateError}
            onChange={onDateRangeChange}
          />
        </div>

        <div className="min-w-0 sm:w-56">
          {projectsError ? (
            <div className="flex items-end gap-2">
              <div className="min-w-0 flex-1">
                <StatisticsSelect
                  inputId="statistics-project"
                  label="Project"
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
          ) : (
            <StatisticsSelect
              inputId="statistics-project"
              options={projectOptions}
              value={selectedProjectOption}
              isLoading={isProjectsLoading}
              isDisabled={isProjectsLoading}
              onChange={(option) =>
                onProjectChange(option?.value ? option.value : null)
              }
            />
          )}
        </div>

        <div className="min-w-0 sm:w-56">
          <StatisticsSelect
            inputId="statistics-status"
            options={statusOptions}
            value={selectedStatusOption}
            onChange={(option) =>
              onStatusChange(option?.value ? (option.value as TaskStatus) : null)
            }
          />
        </div>
      </div>
    </section>
  )
}
