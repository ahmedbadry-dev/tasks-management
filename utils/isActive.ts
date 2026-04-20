export const isActive = (pathname: string, href: string) => {
  if (href === '/') {
    return pathname === '/'
  }

  if (pathname === href) {
    return true
  }

  // only active if /project or /project/add
  // not active when /project/[projectId]/---
  if (href === '/project') {
    return pathname === '/project' || pathname.startsWith('/project/add')
  }

  if (pathname.startsWith(href + '/')) {
    return true
  }

  return false
}
