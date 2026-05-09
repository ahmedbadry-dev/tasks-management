'use client'

import Link from 'next/link'
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import { routes } from '@/lib/routes'
import {
  STATUS_COLORS,
  TASK_STATUSES,
  formatStatusLabel,
} from '../constants'
import type { TaskStatus } from '../types'

type TasksByStatusChartProps = {
  totals: Partial<Record<TaskStatus, number>>
  isLoading: boolean
  variant?: 'desktop' | 'mobile'
}

export const TasksByStatusChart = ({
  totals,
  isLoading,
  variant = 'desktop',
}: TasksByStatusChartProps) => {
  const chartData = TASK_STATUSES.map((status) => ({
    name: formatStatusLabel(status),
    value: totals[status] ?? 0,
    color: STATUS_COLORS[status],
  })).filter((item) => item.value > 0)

  const totalCount = chartData.reduce((sum, item) => sum + item.value, 0)
  const isMobile = variant === 'mobile'
  const chartSize = isMobile ? 132 : 220
  const innerRadius = isMobile ? 42 : 70
  const outerRadius = isMobile ? 64 : 105

  return (
    <section className={isMobile ? 'rounded-lg bg-white p-5 shadow-sm' : 'rounded-lg bg-white p-6 shadow-sm'}>
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="heading-3 font-bold">Tasks by Status</h2>
        {!isMobile && (
          <Link
            href={routes.project.list}
            className="type-label-sm font-semibold text-primary"
          >
            View All
          </Link>
        )}
      </div>

      {isLoading ? (
        <div className={isMobile ? 'flex items-center gap-4' : 'flex flex-col items-center gap-6 sm:flex-row'}>
          <div
            className="shrink-0 animate-pulse rounded-full bg-surface-highest"
            style={{ width: chartSize, height: chartSize }}
          />
          <div className="flex w-full flex-1 flex-col gap-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-8 animate-pulse rounded bg-surface-highest"
              />
            ))}
          </div>
        </div>
      ) : chartData.length > 0 ? (
        <div className={isMobile ? 'flex items-center gap-4' : 'flex flex-col items-center gap-6 sm:flex-row'}>
          <div
            className="relative shrink-0"
            style={{ width: chartSize, height: chartSize }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={innerRadius}
                  outerRadius={outerRadius}
                  dataKey="value"
                  strokeWidth={2}
                >
                  {chartData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [String(value), String(name)]}
                  contentStyle={{ borderRadius: 8, fontSize: 12 }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className={isMobile ? 'heading-3 font-bold' : 'heading-2'}>
                {totalCount}
              </span>
              <span className="type-label-sm text-slate-400">Total</span>
            </div>
          </div>

          <div className="flex w-full flex-1 flex-col gap-3">
            {chartData.map((entry) => (
              <div key={entry.name} className="flex flex-col gap-1">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ background: entry.color }}
                    />
                    <span className="type-label-sm truncate">
                      {entry.name}
                    </span>
                  </div>
                  <span className="type-label-sm font-bold">
                    {entry.value}
                  </span>
                </div>
                {!isMobile && (
                  <div className="h-1.5 w-full rounded-full bg-surface-highest">
                    <div
                      className="h-1.5 rounded-full"
                      style={{
                        width: `${(entry.value / totalCount) * 100}%`,
                        background: entry.color,
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="type-body-md py-10 text-center text-slate-400">
          No status data available
        </p>
      )}
    </section>
  )
}
