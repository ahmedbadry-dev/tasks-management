import { cn } from '@/utils/cn'
import { STATUS_STYLES, TASK_STATUSES } from '../constants'
import type { DateRange, DayStats, TaskStatus } from '../types'
import {
  expandDateRange,
  formatDayLabel,
  toDateString,
} from '../utils/dateRange'

type MobileWeeklyCalendarProps = {
  daily: DayStats[]
  dateRange: DateRange
  isLoading: boolean
}

const countBadgeClassName = (status: TaskStatus) =>
  cn(
    'type-label-sm flex h-5 min-w-5 items-center justify-center rounded px-1 font-bold',
    STATUS_STYLES[status].badge
  )

export const MobileWeeklyCalendar = ({
  daily,
  dateRange,
  isLoading,
}: MobileWeeklyCalendarProps) => {
  const days = expandDateRange(dateRange.start, dateRange.end)
  const today = toDateString(new Date())

  return (
    <section>
      <h2 className="heading-3 mb-3 font-bold">Calendar</h2>

      {isLoading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 7 }).map((_, index) => (
            <div
              key={index}
              className="h-16 animate-pulse rounded-lg bg-surface-highest"
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {days.map((date) => {
            const dayStats = daily.find((item) => item.day === date)
            const { dayName, dayMonth } = formatDayLabel(date)
            const statusRows = TASK_STATUSES.map((status) => ({
              status,
              count: dayStats?.statuses[status] ?? 0,
            })).filter((item) => item.count > 0)
            const isToday = date === today

            return (
              <article
                key={date}
                className={cn(
                  'relative flex min-h-16 items-center rounded-lg bg-surface-low px-4 py-3',
                  isToday && 'bg-white shadow-sm ring-1 ring-surface-highest'
                )}
              >
                {isToday && (
                  <span className="absolute inset-y-0 left-0 w-1 rounded-l-lg bg-primary" />
                )}

                <div className="w-14 shrink-0">
                  <p
                    className={cn(
                      'type-label-sm text-slate-400',
                      isToday && 'text-primary'
                    )}
                  >
                    {dayName}
                  </p>
                  <p className="heading-3 font-bold">{dayMonth.split(' ')[0]}</p>
                </div>

                <div className="mr-4 h-8 w-px bg-surface-highest" />

                <div className="flex min-w-0 flex-1 flex-wrap gap-2">
                  {statusRows.length > 0 ? (
                    statusRows.map(({ status, count }) => (
                      <span key={status} className={countBadgeClassName(status)}>
                        {count}
                      </span>
                    ))
                  ) : (
                    <span className="type-label-sm flex h-5 min-w-5 items-center justify-center rounded bg-surface-highest px-1 font-bold text-slate-400">
                      0
                    </span>
                  )}
                </div>

                {isToday && (
                  <span className="type-label-sm rounded-full bg-primary px-3 py-0.5 text-white">
                    Today
                  </span>
                )}
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}
