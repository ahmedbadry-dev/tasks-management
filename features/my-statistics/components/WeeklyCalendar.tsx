import { CalendarIcon } from '@/shared/components/icons'
import { cn } from '@/utils/cn'
import { TASK_STATUSES, STATUS_STYLES, formatStatusLabel } from '../constants'
import type { DateRange, DayStats } from '../types'
import {
  expandDateRange,
  formatDayLabel,
  toDateString,
} from '../utils/dateRange'

type WeeklyCalendarProps = {
  daily: DayStats[]
  dateRange: DateRange
  isLoading: boolean
}

export const WeeklyCalendar = ({
  daily,
  dateRange,
  isLoading,
}: WeeklyCalendarProps) => {
  const days = expandDateRange(dateRange.start, dateRange.end)
  const today = toDateString(new Date())

  if (isLoading) {
    return (
      <section className="overflow-x-auto pt-4">
        <div className="grid min-w-[1120px] grid-cols-7 gap-3 px-1 pb-2 lg:min-w-0">
          {Array.from({ length: 7 }).map((_, index) => (
            <div
              key={index}
              className="h-80 animate-pulse rounded-lg bg-surface-highest"
            />
          ))}
        </div>
      </section>
    )
  }

  return (
    <section className="overflow-x-auto pt-4">
      <div
        className="grid min-w-[1120px] gap-3 px-1 pb-2 lg:min-w-0"
        style={{
          gridTemplateColumns: `repeat(${days.length}, minmax(160px, 1fr))`,
        }}
      >
        {days.map((date) => {
          const dayStats = daily.find((item) => item.day === date)
          const { dayName, dayMonth } = formatDayLabel(date)
          const statusRows = TASK_STATUSES.map((status) => ({
            status,
            count: dayStats?.statuses[status] ?? 0,
          })).filter((item) => item.count > 0)
          const isToday = date === today

          return (
            <article key={date} className="relative min-w-0">
              {isToday && (
                <div className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1/2">
                  <span className="type-label-sm rounded-full bg-primary px-4 py-1 text-white shadow-sm">
                    Today
                  </span>
                </div>
              )}
              <div
                className={cn(
                  'flex min-h-56 flex-col gap-3 rounded-lg bg-white p-4 shadow-sm',
                  'h-80',
                  isToday && 'ring-2 ring-primary'
                )}
              >
                <div>
                  <p className="type-label-sm font-semibold uppercase text-slate-400">
                    {dayName}
                  </p>
                  <p className="heading-3 font-bold">{dayMonth}</p>
                </div>

                {statusRows.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    {statusRows.map(({ status, count }) => {
                      const styles = STATUS_STYLES[status]

                      return (
                        <div
                          key={status}
                          className={cn(
                            'flex items-center justify-between rounded-md px-2 py-1',
                            styles.row
                          )}
                        >
                          <span className="type-label-sm font-medium">
                            {formatStatusLabel(status)}
                          </span>
                          <span
                            className={cn(
                              'type-label-sm rounded px-1.5 font-bold',
                              styles.badge
                            )}
                          >
                            {count}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="flex flex-1 flex-col items-center justify-center gap-1 py-4 text-slate-300">
                    <CalendarIcon size={24} />
                    <span className="type-label-sm">No Tasks</span>
                  </div>
                )}
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
