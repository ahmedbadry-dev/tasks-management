import { ReactNode } from 'react'
import { StylesConfig } from 'react-select'
import { formatServerDateTime } from '@/features/projects/utils/formatServerDateTime'
import { TTask, TUpdateTaskPatch } from '../../types'

export type SaveTaskPatch = (
  patch: TUpdateTaskPatch,
  nextTask: TTask
) => Promise<boolean>

export type TaskFieldProps = {
  task: TTask
  onSavePatch: SaveTaskPatch
}

export type SelectOption<TValue extends string = string> = {
  label: string
  value: TValue
}

export const UPDATE_ERROR_MESSAGE = 'Failed to update task. Please try again.'

export const selectStyles: StylesConfig<SelectOption, false> = {
  control: (base, state) => ({
    ...base,
    minHeight: 40,
    borderColor: state.isFocused ? '#003D9B' : 'transparent',
    boxShadow: state.isFocused ? '0 0 0 3px rgb(0 54 181 / 0.12)' : 'none',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    cursor: 'pointer',
    ':hover': {
      borderColor: state.isFocused ? '#003D9B' : 'transparent',
    },
  }),
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  menu: (base) => ({
    ...base,
    borderRadius: 8,
    boxShadow: '0 16px 40px rgb(4 27 60 / 0.14)',
    overflow: 'hidden',
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? '#D7E2FF'
      : state.isFocused
        ? '#F1F3FF'
        : '#ffffff',
    color: '#041B3C',
    cursor: 'pointer',
  }),
  indicatorSeparator: () => ({ display: 'none' }),
  valueContainer: (base) => ({ ...base, paddingLeft: 12 }),
}

export const getMenuPortalTarget = () =>
  typeof document === 'undefined' ? undefined : document.body

export const toDateInputValue = (value?: string | null) => {
  if (!value) return ''
  const parsedDate = new Date(value)
  if (Number.isNaN(parsedDate.getTime())) return ''
  return parsedDate.toISOString().split('T')[0]
}

export const getToday = () => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return today
}

export const toServerDueDate = (date: Date | undefined) => {
  if (!date) return null
  const normalizedDate = new Date(date)
  normalizedDate.setHours(23, 59, 0, 0)
  return normalizedDate.toISOString()
}

export const toDateLabel = (value?: string | null) => {
  if (!value) return 'No due date'
  return formatServerDateTime(value).date
}

export const FieldLabel = ({ children }: { children: ReactNode }) => (
  <p className="type-label-sm mb-2 text-slate-400 uppercase">{children}</p>
)
