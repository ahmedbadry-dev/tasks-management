'use client'

import { useState } from 'react'
import { DayPicker, type DateRange as DayPickerDateRange } from 'react-day-picker'
import { CalendarIcon } from '@/shared/components/icons'
import { cn } from '@/utils/cn'
import type { DateRange } from '../types'
import { daysBetween, formatDayLabel, toDateString } from '../utils/dateRange'

type DateRangePickerProps = {
  value: DateRange
  error: string | null
  variant?: 'inline' | 'field'
  onChange: (range: DateRange) => void
}

const parseDateString = (dateStr: string) => {
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(Date.UTC(year, month - 1, day))
}

const toDayPickerRange = (range: DateRange): DayPickerDateRange => ({
  from: parseDateString(range.start),
  to: parseDateString(range.end),
})

const formatRangeLabel = (range: DateRange) => {
  if (!range.start || !range.end) return 'Select date range'
  const start = formatDayLabel(range.start).dayMonth
  const end = formatDayLabel(range.end)
  return `${start} - ${end.dayMonth},${end.year}`
}

export const DateRangePicker = ({
  value,
  error,
  variant = 'inline',
  onChange,
}: DateRangePickerProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [draftRange, setDraftRange] = useState<DayPickerDateRange>(() =>
    toDayPickerRange(value)
  )
  const [draftError, setDraftError] = useState<string | null>(null)

  const openPicker = () => {
    setDraftRange(toDayPickerRange(value))
    setDraftError(null)
    setIsOpen(true)
  }

  const closePicker = () => {
    setDraftRange(toDayPickerRange(value))
    setDraftError(null)
    setIsOpen(false)
  }

  const applyRange = () => {
    if (!draftRange.from || !draftRange.to) {
      setDraftError('Select a start and end date')
      return
    }

    const nextRange = {
      start: toDateString(draftRange.from),
      end: toDateString(draftRange.to),
    }

    // Keep the range validation close to the Apply action for clear feedback.
    if (daysBetween(nextRange.start, nextRange.end) > 7) {
      setDraftError('Date range cannot exceed 7 days')
      return
    }

    onChange(nextRange)
    setDraftError(null)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      {variant === 'field' ? (
        <button
          id="statistics-date-range"
          type="button"
          className="flex h-11 w-full items-center justify-between gap-2 rounded bg-white px-3 text-left text-[12px] font-bold text-slate-900 ring-1 ring-surface-highest"
          aria-expanded={isOpen}
          onClick={() => {
            if (isOpen) {
              closePicker()
            } else {
              openPicker()
            }
          }}
        >
          <span className="truncate">{formatRangeLabel(value)}</span>
          <CalendarIcon size={14} className="shrink-0 text-slate-600" />
        </button>
      ) : (
        <div className="flex items-center gap-4">
          <button
            type="button"
            aria-label="Open previous date range"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-slate-600 hover:bg-white/70 hover:text-primary"
            // prev 7 days
            onClick={openPicker}
          >
            <span className="text-lg leading-none">&lt;</span>
          </button>

          <button
            id="statistics-date-range"
            type="button"
            className={cn(
              'type-body-md min-w-0 text-left font-bold text-slate-900',
              'cursor-pointer hover:text-primary'
            )}
            aria-expanded={isOpen}
            onClick={() => {
              if (isOpen) {
                closePicker()
              } else {
                openPicker()
              }
            }}
          >
            {formatRangeLabel(value)}
          </button>

          <button
            type="button"
            aria-label="Open next date range"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-slate-600 hover:bg-white/70 hover:text-primary"
            // next 7 days
            onClick={openPicker}
          >
            <span className="text-lg leading-none">&gt;</span>
          </button>
        </div>
      )}

      {(error || draftError) && (
        <p className="field-error mt-1">{draftError ?? error}</p>
      )}

      {isOpen && (
        <div
          className={cn(
            'z-30 rounded-lg bg-white p-4 shadow-card ring-1 ring-surface-highest',
            variant === 'field'
              ? 'fixed left-4 right-4 top-28 max-h-[calc(100dvh-8rem)] overflow-y-auto sm:absolute sm:left-0 sm:right-auto sm:top-full sm:mt-2 sm:w-[min(22rem,calc(100vw-2rem))]'
              : 'absolute left-0 top-full mt-2 w-[min(22rem,calc(100vw-2rem))]'
          )}
        >
          <DayPicker
            mode="range"
            selected={draftRange}
            onSelect={(range) => {
              setDraftRange(range ?? { from: undefined })
              setDraftError(null)
            }}
            defaultMonth={draftRange.from}
            max={7}
            timeZone="UTC"
            weekStartsOn={0}
            showOutsideDays
            fixedWeeks
            classNames={{
              root: 'w-full',
              months: 'flex flex-col',
              month: 'space-y-3',
              month_caption: 'flex items-center justify-center px-9',
              caption_label: 'heading-4 font-bold text-slate-900',
              nav: 'absolute left-4 right-4 top-4 flex items-center justify-between',
              button_previous:
                'flex h-8 w-8 items-center justify-center rounded-md text-slate-600 hover:bg-surface-low',
              button_next:
                'flex h-8 w-8 items-center justify-center rounded-md text-slate-600 hover:bg-surface-low',
              chevron: 'h-4 w-4 fill-primary',
              month_grid: 'w-full border-collapse',
              weekdays: 'grid grid-cols-7',
              weekday:
                'type-label-sm flex h-8 items-center justify-center text-slate-400',
              weeks: 'block',
              week: 'grid grid-cols-7',
              day: 'relative flex h-9 items-center justify-center text-center',
              day_button:
                'type-label-sm flex h-8 w-8 items-center justify-center rounded-md text-slate-900 hover:bg-surface-low',
              today: '[&>button]:ring-1 [&>button]:ring-primary',
              outside: '[&>button]:text-slate-300',
              disabled:
                '[&>button]:cursor-not-allowed [&>button]:text-slate-300',
              selected:
                '[&>button]:bg-primary [&>button]:text-white [&>button]:hover:bg-primary',
              range_start:
                'rounded-l-md bg-primary/10 [&>button]:bg-primary [&>button]:text-white',
              range_middle:
                'bg-primary/10 [&>button]:rounded-none [&>button]:bg-transparent [&>button]:text-primary',
              range_end:
                'rounded-r-md bg-primary/10 [&>button]:bg-primary [&>button]:text-white',
            }}
          />

          <div className="mt-4 flex items-center justify-end gap-2 border-t border-surface-highest pt-3">
            <button
              type="button"
              className="btn btn-ghost px-4"
              onClick={closePicker}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary px-4"
              onClick={applyRange}
            >
              Apply Range
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
