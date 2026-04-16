import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export function useSidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  // in mobile close menu when we change the path name (route)
  useEffect(() => {
    setIsMobileOpen(false)
  }, [pathname])

  // we disable scroll if menu in mobile is open
  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileOpen])

  return {
    isCollapsed,
    isMobileOpen,
    toggleCollapse: () => setIsCollapsed((p) => !p),
    toggleMobile: () => setIsMobileOpen((p) => !p),
    closeMobile: () => setIsMobileOpen(false),
  }
}
