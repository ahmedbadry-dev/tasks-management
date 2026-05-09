import type { DateRange } from '../types'

const MS_PER_DAY = 24 * 60 * 60 * 1000

const parseDateString = (dateStr: string) => {
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(Date.UTC(year, month - 1, day))
}

export function toDateString(date: Date): string {
  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const day = String(date.getUTCDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export function getCurrentWeekRange(): DateRange {
  const now = new Date()
  const today = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  )

  // UTC weekday gives Sunday as 0. This offset moves the start to Monday.
  const weekday = today.getUTCDay()
  const mondayOffset = weekday === 0 ? -6 : 1 - weekday
  const monday = new Date(today)
  monday.setUTCDate(today.getUTCDate() + mondayOffset)

  const sunday = new Date(monday)
  sunday.setUTCDate(monday.getUTCDate() + 6)

  return {
    start: toDateString(monday),
    end: toDateString(sunday),
  }
}

export function daysBetween(start: string, end: string): number {
  const startDate = parseDateString(start)
  const endDate = parseDateString(end)

  return Math.floor((endDate.getTime() - startDate.getTime()) / MS_PER_DAY) + 1
}

export function formatDayLabel(dateStr: string): {
  dayName: string
  dayMonth: string
  year: string
} {
  const date = parseDateString(dateStr)

  const dayName = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    timeZone: 'UTC',
  })
    .format(date)
    .toUpperCase()

  const dayMonth = new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
  }).format(date)

  const year = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date)

  return { dayName, dayMonth, year }
}

export function expandDateRange(start: string, end: string): string[] {
  const days: string[] = []
  const current = parseDateString(start)
  const last = parseDateString(end)

  while (current.getTime() <= last.getTime()) {
    days.push(toDateString(current))
    current.setUTCDate(current.getUTCDate() + 1)
  }

  return days
}
