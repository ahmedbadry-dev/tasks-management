'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import { usePathname } from 'next/navigation'
import { cn } from '@/utils/cn'
import { routes } from '@/lib/routes'

type ProjectBreadcrumbHeaderProps = {
  projectId: string
  projectName: string
}

type BreadcrumbItem = {
  label: string
  href?: string
}

const buildProjectBreadcrumbItems = (
  pathname: string,
  projectId: string,
  projectName: string
): BreadcrumbItem[] => {
  const projectBase = `/project/${encodeURIComponent(projectId)}`

  // Keep breadcrumb generation centralized so every project page follows one rule-set.
  const breadcrumbRoutes: Array<{ match: string; items: BreadcrumbItem[] }> = [
    {
      match: `${projectBase}/epics/new`,
      items: [
        { label: 'Epics', href: routes.project.epics(projectId) },
        { label: 'New Epic' },
      ],
    },
    { match: `${projectBase}/epics`, items: [{ label: 'Epics' }] },
    {
      match: `${projectBase}/tasks/new`,
      items: [
        { label: 'Tasks', href: routes.project.tasks(projectId) },
        { label: 'New Task' },
      ],
    },
    { match: `${projectBase}/tasks`, items: [{ label: 'Tasks' }] },
    { match: `${projectBase}/members`, items: [{ label: 'Members' }] },
    { match: `${projectBase}/edit`, items: [{ label: 'Details' }] },
  ]

  const matchedBreadcrumbRoute = breadcrumbRoutes.find((entry) =>
    pathname.startsWith(entry.match)
  )

  return [
    { label: 'Projects', href: routes.project.list },
    { label: projectName },
    ...(matchedBreadcrumbRoute?.items ?? []),
  ]
}

export const ProjectBreadcrumbHeader = ({
  projectId,
  projectName,
}: ProjectBreadcrumbHeaderProps) => {
  const pathname = usePathname()

  const breadcrumbItems = useMemo(
    () => buildProjectBreadcrumbItems(pathname, projectId, projectName),
    [pathname, projectId, projectName]
  )

  return (
    <section>
      <nav aria-label="Project breadcrumb" className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1
          return (
            <div key={`${item.label}-${index}`} className="flex items-center gap-2">
              {item.href && !isLast ? (
                <Link href={item.href} className="hover:text-slate-800">
                  {item.label}
                </Link>
              ) : (
                <span className={cn(isLast && 'font-semibold text-slate-900')}>{item.label}</span>
              )}
              {!isLast && <span className="text-slate-300">/</span>}
            </div>
          )
        })}
      </nav>
    </section>
  )
}
