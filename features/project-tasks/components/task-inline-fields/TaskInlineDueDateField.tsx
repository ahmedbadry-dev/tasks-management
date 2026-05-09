import { useCallback, useState } from 'react'
import { toast } from 'sonner'
import { cn } from '@/utils/cn'
import { DatePickerPortal } from './DatePickerPortal'
import {
  getToday,
  TaskFieldProps,
  toDateInputValue,
  toDateLabel,
  toServerDueDate,
  UPDATE_ERROR_MESSAGE,
} from './shared'

export const TaskInlineDueDateField = ({ task, onSavePatch }: TaskFieldProps) => {
  const [buttonElement, setButtonElement] = useState<HTMLButtonElement | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const dateValue = toDateInputValue(task.due_date)
  const selectedDate = dateValue ? new Date(`${dateValue}T00:00:00`) : undefined

  const handleSelect = useCallback(
    async (date: Date | undefined) => {
      if (isSaving) return

      if (date && date < getToday()) {
        toast.error(UPDATE_ERROR_MESSAGE)
        return
      }

      const nextDueDate = toServerDueDate(date)
      const currentDueDate = task.due_date ?? null

      if (nextDueDate === currentDueDate) {
        setIsEditing(false)
        return
      }

      setIsSaving(true)
      await onSavePatch({ due_date: nextDueDate }, { ...task, due_date: nextDueDate })
      setIsEditing(false)
      setIsSaving(false)
    },
    [isSaving, onSavePatch, task]
  )

  return (
    <div>
      <button
        ref={setButtonElement}
        type="button"
        onClick={() => setIsEditing(true)}
        disabled={isSaving}
        className="flex flex-col md:flex-row min-h-10 w-full justify-between rounded-lg px-1 py-1 text-left transition-colors hover:bg-surface-highest/50 focus-visible:outline-2 focus-visible:outline-primary disabled:opacity-70"
      >
        <p className="type-label-sm mb-3 text-[12px] text-slate-400">Due Date</p>
        <p className={cn('type-body-md font-semibold text-slate-900', !task.due_date && 'text-slate-500')}>
          {toDateLabel(task.due_date)}
        </p>
      </button>

      {isEditing && (
        <DatePickerPortal
          anchor={buttonElement}
          selected={selectedDate}
          onSelect={(date) => void handleSelect(date)}
          onClear={() => void handleSelect(undefined)}
          onClose={() => setIsEditing(false)}
        />
      )}
    </div>
  )
}
