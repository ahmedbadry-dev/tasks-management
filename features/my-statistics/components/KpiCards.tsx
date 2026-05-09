import {
  CheckCircleIcon,
  ChecklistIcon,
  WarningTriangleIcon,
} from '@/shared/components/icons'
import { cn } from '@/utils/cn'

type KpiCardsProps = {
  total_tasks: number
  done_tasks: number
  overdue_tasks: number
  isLoading: boolean
}

const KpiValue = ({
  value,
  isLoading,
  className,
}: {
  value: number
  isLoading: boolean
  className?: string
}) => {
  if (isLoading) {
    return <div className="mt-1 h-8 w-16 animate-pulse rounded bg-surface-highest" />
  }

  return <p className={cn('heading-2 mt-1', className)}>{value}</p>
}

export const KpiCards = ({
  total_tasks,
  done_tasks,
  overdue_tasks,
  isLoading,
}: KpiCardsProps) => {
  const cards = [
    {
      title: 'Total Tasks',
      value: total_tasks,
      icon: <ChecklistIcon size={22} />,
      valueClassName: undefined,
    },
    {
      title: 'Completed Tasks',
      value: done_tasks,
      icon: <CheckCircleIcon size={22} />,
      valueClassName: undefined,
    },
    {
      title: 'Overdue Tasks',
      value: overdue_tasks,
      icon: <WarningTriangleIcon size={22} />,
      valueClassName: 'text-error',
    },
  ]

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {cards.map((card) => (
        <div
          key={card.title}
          className="flex items-center justify-between rounded-lg bg-white p-5 shadow-sm"
        >
          <div>
            <p className="type-label-sm font-semibold uppercase text-slate-400">
              {card.title}
            </p>
            <KpiValue
              value={card.value}
              isLoading={isLoading}
              className={card.valueClassName}
            />
          </div>
          <div className="rounded-lg bg-surface-low p-3 text-primary">
            {card.icon}
          </div>
        </div>
      ))}
    </section>
  )
}
