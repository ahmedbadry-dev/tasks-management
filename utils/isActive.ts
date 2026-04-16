export const isActive = (pathname: string, href: string) => {
  if (href === '/') {
    return pathname === '/'
  }

  if (pathname === href) {
    return true
  }

  if (pathname.startsWith(href + '/')) {
    return true
  }

  return false
}
