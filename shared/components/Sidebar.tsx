'use client'
import Link from "next/link"
import { useParams, usePathname } from "next/navigation"
import clsx from "clsx"
import { getNavLinks } from "@/shared/config/nav"
import { ArrowLeftIcon, LogoutIcon } from "@/shared/components/icons"
import { isActive } from "@/utils/isActive"
import { useTransition } from "react"
import { signOutAction } from "@/features/auth/actions/signOutAction"
import { useAppDispatch } from "@/store/hooks"
import { clearUser } from "@/store/userStore/userSlice"

type Props = {
    isCollapsed: boolean
    isMobileOpen: boolean
    onToggleCollapse: () => void
}


export const Sidebar = ({ isCollapsed, isMobileOpen, onToggleCollapse }: Props) => {
    const pathname = usePathname()
    const { projectId } = useParams<{ projectId: string }>()
    const hideLabels = isCollapsed && !isMobileOpen
    const links = getNavLinks(projectId)

    return (
        <aside className={clsx(
            "absolute inset-y-0 left-0 z-40 flex flex-col  bg-surface-low transition-all duration-300",
            "md:static md:translate-x-0",
            isMobileOpen ? "w-[82%] max-w-65 translate-x-0" : "-translate-x-full md:translate-x-0",
            isCollapsed ? "md:w-19" : "md:w-57"
        )}>
            <nav className="flex-1 px-2 py-3">
                <ul className="space-y-1">
                    {links.map((item) => (
                        <li key={item.label}>
                            <Link
                                href={item.href}
                                className={clsx(
                                    "flex w-full items-center gap-2 text-[12px] transition-colors px-3 py-2.5 rounded  ",
                                    isActive(pathname, item.href)
                                        ? "bg-white text-primary shadow-[0px_1px_2px_0px_#0000000D]"
                                        : "text-slate-600 hover:bg-white/70 hover:text-slate-900",
                                    hideLabels && "md:justify-center",

                                )}
                            >
                                <span className="shrink-0">{item.icon}</span>
                                <span className={clsx("truncate", hideLabels && "md:hidden")}>
                                    {item.label}
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            <SidebarFooter isCollapsed={isCollapsed} hideLabels={hideLabels} onToggleCollapse={onToggleCollapse} />
        </aside>
    )
}

const SidebarFooter = ({ isCollapsed, hideLabels, onToggleCollapse }: {
    isCollapsed: boolean
    hideLabels: boolean
    onToggleCollapse: () => void
}) => {
    const [isPending, startTransition] = useTransition()
    const dispatch = useAppDispatch()


    const handleLogout = () => {
        startTransition(async () => {
            dispatch(clearUser())
            await signOutAction()
        })
    }
    return (
        <div className="border-t border-black/10 p-2">
            <button
                type="button"
                onClick={onToggleCollapse}
                className={clsx(
                    "hidden w-full items-center gap-2 rounded-md px-2 py-2 text-[12px] text-slate-600 hover:bg-white/70 md:flex",
                    isCollapsed && "md:justify-center"
                )}
            >
                <ArrowLeftIcon size={12} className={clsx("transition-transform", isCollapsed && "rotate-180")} />
                <span className={clsx(isCollapsed && "md:hidden")}>Collapse</span>
            </button>

            <button
                type="button"
                className={clsx(
                    "mt-1 flex w-full items-center gap-2 rounded-md px-2 py-2 text-[12px] text-error hover:bg-error/10",
                    hideLabels && "md:justify-center"
                )}
                onClick={handleLogout}
                disabled={isPending}
            >
                <LogoutIcon className="h-4 w-4" />
                <span className={clsx(hideLabels && "md:hidden")}>{isPending ? 'Logout...' : 'Logout'}</span>
            </button>
        </div>
    )
}