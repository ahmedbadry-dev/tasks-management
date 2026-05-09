import {
  CheckCircleIcon,
  ChecklistIcon,
  WarningTriangleIcon,
} from '@/shared/components/icons'
import { cn } from '@/utils/cn'

type MobileKpiCardsProps = {
  total_tasks: number
  done_tasks: number
  overdue_tasks: number
  isLoading: boolean
}

export const MobileKpiCards = ({
  total_tasks,
  done_tasks,
  overdue_tasks,
  isLoading,
}: MobileKpiCardsProps) => {
  const cards = [
    {
      title: 'Total Tasks',
      value: total_tasks,
      icon: <ChecklistIcon size={18} />,
      valueClassName: undefined,
    },
    {
      title: 'Completed',
      value: done_tasks,
      icon: <CheckCircleIcon size={18} />,
      valueClassName: undefined,
    },
    {
      title: 'Overdue',
      value: overdue_tasks,
      icon: <WarningTriangleIcon size={18} />,
      valueClassName: 'text-error',
    },
  ]

  return (
    <section>
      <h2 className="type-label-sm mb-3 text-slate-600">Quick Overview</h2>
      <div className="flex gap-3 overflow-x-auto pb-1">
        {cards.map((card) => (
          <div
            key={card.title}
            className="min-w-[136px] rounded-lg bg-white p-4 shadow-sm"
          >
            <div className="mb-3 text-primary">{card.icon}</div>
            <p className="type-label-sm text-slate-400">{card.title}</p>
            {isLoading ? (
              <div className="mt-1 h-7 w-12 animate-pulse rounded bg-surface-highest" />
            ) : (
              <p className={cn('heading-2 mt-1', card.valueClassName)}>
                {card.value}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
