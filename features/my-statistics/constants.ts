import type { TaskStatus } from './types'

export const TASK_STATUSES: readonly TaskStatus[] = [
  'TO_DO',
  'IN_PROGRESS',
  'BLOCKED',
  'IN_REVIEW',
  'READY_FOR_QA',
  'REOPENED',
  'READY_FOR_PRODUCTION',
  'DONE',
] as const

export const STATUS_COLORS: Record<TaskStatus, string> = {
  TO_DO: '#94A3B8',
  IN_PROGRESS: '#003D9B',
  BLOCKED: '#BA1A1A',
  IN_REVIEW: '#CA8A04',
  READY_FOR_QA: '#7C3AED',
  REOPENED: '#EA580C',
  READY_FOR_PRODUCTION: '#16A34A',
  DONE: '#059669',
}

export const STATUS_STYLES: Record<
  TaskStatus,
  { row: string; badge: string }
> = {
  TO_DO: {
    row: 'bg-surface-low',
    badge: 'bg-surface-highest text-slate-900',
  },
  IN_PROGRESS: {
    row: 'bg-primary/10',
    badge: 'bg-primary text-white',
  },
  BLOCKED: {
    row: 'bg-error-container',
    badge: 'bg-error/20 text-error',
  },
  IN_REVIEW: {
    row: 'bg-yellow-50',
    badge: 'bg-yellow-100 text-yellow-700',
  },
  READY_FOR_QA: {
    row: 'bg-purple-50',
    badge: 'bg-purple-100 text-purple-700',
  },
  REOPENED: {
    row: 'bg-orange-50',
    badge: 'bg-orange-100 text-orange-700',
  },
  READY_FOR_PRODUCTION: {
    row: 'bg-emerald-50',
    badge: 'bg-emerald-100 text-emerald-700',
  },
  DONE: {
    row: 'bg-emerald-50',
    badge: 'bg-emerald-100 text-emerald-700',
  },
}

export const formatStatusLabel = (status: TaskStatus) =>
  status
    .split('_')
    .map((part) => part[0] + part.slice(1).toLowerCase())
    .join(' ')
