export const getInitials = (name?: string | null) => {
  const safeName = name?.trim()
  if (!safeName) return 'GS'

  const parts = safeName.split(/\s+/).filter(Boolean)

  if (parts.length === 0) return 'GS'

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase()
  }

  return (parts[0][0] + parts[1][0]).toUpperCase()
}
