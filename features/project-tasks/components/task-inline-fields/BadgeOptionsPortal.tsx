import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

type Option = {
  label: string
  value: string
}

type Props = {
  anchor: HTMLElement | null
  options: Option[]
  activeValue: string
  onSelect: (value: string) => void
  onClose: () => void
  minWidth?: number
}

export const BadgeOptionsPortal = ({
  anchor,
  options,
  activeValue,
  onSelect,
  onClose,
  minWidth = 180,
}: Props) => {
  const [mounted, setMounted] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0, width: minWidth })

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!anchor) return

    const updatePosition = () => {
      const rect = anchor.getBoundingClientRect()
      const popupWidth = Math.max(minWidth, rect.width)
      setPosition({
        top: rect.bottom + 8,
        left: Math.max(12, Math.min(rect.left, window.innerWidth - (popupWidth + 12))),
        width: popupWidth,
      })
    }

    updatePosition()
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [anchor, minWidth])

  if (!mounted || typeof document === 'undefined') return null

  return createPortal(
    <div className="fixed inset-0 z-[9998]" onMouseDown={onClose}>
      <div
        className="fixed z-[9999] rounded-lg border border-slate-200 bg-white p-1 shadow-xl"
        style={{ top: position.top, left: position.left, width: position.width }}
        onMouseDown={(event) => event.stopPropagation()}
      >
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            className={`block w-full rounded-md px-3 py-2 text-left text-sm ${
              option.value === activeValue ? 'bg-surface-highest text-slate-900' : 'text-slate-700 hover:bg-surface-low'
            }`}
            onClick={() => onSelect(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>,
    document.body
  )
}
