import { useEffect, useState, useSyncExternalStore } from 'react'
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

const MOBILE_BREAKPOINT = 640
const VIEWPORT_GUTTER = 16
const subscribeToMounted = () => () => undefined
const getMountedSnapshot = () => true
const getServerMountedSnapshot = () => false

export const DatePickerPortal = ({
  anchor,
  selected,
  onSelect,
  onClear,
  onClose,
}: Props) => {
  const mounted = useSyncExternalStore(
    subscribeToMounted,
    getMountedSnapshot,
    getServerMountedSnapshot
  )
  const [position, setPosition] = useState({
    top: 0,
    left: 0,
    width: 260,
  })

  useEffect(() => {
    if (!anchor) return

    const updatePosition = () => {
      const rect = anchor.getBoundingClientRect()
      const isMobile = window.innerWidth < MOBILE_BREAKPOINT
      const maxWidth = window.innerWidth - VIEWPORT_GUTTER * 2
      const width = Math.min(Math.max(rect.width, 260), maxWidth)
      const left = Math.min(
        Math.max(rect.left, VIEWPORT_GUTTER),
        window.innerWidth - width - VIEWPORT_GUTTER
      )

      setPosition({
        top: isMobile ? VIEWPORT_GUTTER : rect.bottom + 8,
        left,
        width,
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
        className="fixed z-[9999] max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-lg border border-slate-200 bg-white p-3 shadow-xl"
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
