'use client'
import Link from "next/link"
import { useParams, usePathname } from "next/navigation"
import clsx from "clsx"
import { getNavLinks } from "@/shared/config/nav"
import { isActive } from "@/utils/isActive"

export const MobileNav = ({ hidden }: { hidden: boolean }) => {
    const pathname = usePathname()
    const { projectId } = useParams<{ projectId: string }>()
    const links = getNavLinks(projectId)

    return (
        <nav className={clsx(
            "fixed inset-x-0 bottom-0 z-20 border-t border-black/10 bg-surface-low md:hidden",
            hidden && "pointer-events-none opacity-0"
        )}>
            <ul className="flex h-16">
                {links.map((item) => {
                    const active = isActive(pathname, item.href)
                    return (
                        <li key={item.label} className="flex-1">
                            <Link
                                href={item.href}
                                className={clsx(
                                    "flex h-full flex-col items-center justify-center gap-1 text-[9px]",
                                    active ? "text-primary" : "text-slate-400"
                                )}
                            >
                                {item.icon}
                                <span className="truncate">{item.mobileLabel}</span>
                            </Link>
                        </li>
                    )
                })}
            </ul>
        </nav>
    )
}