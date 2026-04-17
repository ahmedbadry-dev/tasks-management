'use client'

import { useSidebar } from "@/hooks/useSidebar"
import { Header } from "./Header"
import { MobileNav } from "./MobileNav"
import { Sidebar } from "./Sidebar"
import { AuthUser } from "@/features/auth/types"

type props = {
    children: React.ReactNode,
    user: AuthUser
}
export const DashboardView = ({ user, children }: props) => {
    const { isCollapsed, isMobileOpen, toggleCollapse, toggleMobile, closeMobile } = useSidebar()
    const { user_metadata } = user

    return (
        <div className="flex min-h-dvh flex-col bg-background">
            <Header isMobileOpen={isMobileOpen} onToggleMobile={toggleMobile} user_metadata={user.user_metadata} />

            <div className="relative flex min-h-0 flex-1">
                {/* Overlay btn to make user close menu if click out of the menu */}
                {isMobileOpen && (
                    <button
                        type="button"
                        aria-label="Close menu overlay"
                        className="absolute inset-0 z-30 bg-black/25 md:hidden"
                        onClick={closeMobile}
                    />
                )}

                <Sidebar
                    isCollapsed={isCollapsed}
                    isMobileOpen={isMobileOpen}
                    onToggleCollapse={toggleCollapse}
                />

                <main className="min-h-0 flex-1 overflow-y-auto p-4 pb-20 md:p-6 md:pb-6">
                    <div className="@container/main mx-auto w-full max-w-7xl h-full">
                        {children}
                    </div>
                </main>
            </div>

            <MobileNav hidden={isMobileOpen} />
        </div>
    )
}
