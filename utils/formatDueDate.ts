export const formatDueDate = (date: string | null): string => {
  if (!date) return 'No due date'
  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}
