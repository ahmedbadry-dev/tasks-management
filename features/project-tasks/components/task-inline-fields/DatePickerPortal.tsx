import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { DayPicker } from 'react-day-picker'
import { getToday } from './shared'

type Props = {
  anchor: HTMLElement | null
  selected: Date | undefined
  onSelect: (date: Date | undefined) => void
  onClear: () => void
  onClose: () => void
}

export const DatePickerPortal = ({
  anchor,
  selected,
  onSelect,
  onClear,
  onClose,
}: Props) => {
  const [mounted, setMounted] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0, width: 260 })

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!anchor) return

    const updatePosition = () => {
      const rect = anchor.getBoundingClientRect()
      setPosition({
        top: rect.bottom + 8,
        left: Math.min(rect.left, window.innerWidth - 288),
        width: Math.max(rect.width, 260),
      })
    }

    updatePosition()
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)

    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [anchor])

  if (!mounted || typeof document === 'undefined') return null

  return createPortal(
    <div className="fixed inset-0 z-[9998]" onMouseDown={onClose}>
      <div
        className="fixed z-[9999] rounded-lg border border-slate-200 bg-white p-3 shadow-xl"
        style={{ top: position.top, left: position.left, width: position.width }}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <DayPicker
          mode="single"
          selected={selected}
          onSelect={onSelect}
          disabled={{ before: getToday() }}
          classNames={{
            month_caption: 'mb-2 text-center font-semibold text-slate-900',
            nav: 'flex items-center justify-between',
            button_previous: 'rounded px-2 py-1 hover:bg-surface-low',
            button_next: 'rounded px-2 py-1 hover:bg-surface-low',
            weekdays: 'grid grid-cols-7 text-center text-[11px] font-semibold uppercase text-slate-400',
            week: 'grid grid-cols-7',
            day: 'p-0 text-center',
            day_button: 'h-8 w-8 rounded-md text-sm hover:bg-surface-low',
            selected: 'rounded-md bg-primary text-white',
            today: 'font-bold text-primary',
            disabled: 'text-slate-300',
          }}
        />
        <div className="mt-2 flex justify-end gap-2 border-t border-slate-200 pt-2">
          <button type="button" onClick={onClear} className="btn btn-ghost px-2 py-1 text-xs">
            Clear
          </button>
          <button type="button" onClick={onClose} className="btn btn-ghost px-2 py-1 text-xs text-primary">
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
