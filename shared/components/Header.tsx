import { Logo } from "@/shared/components/Logo"
import { MenuIcon } from "./icons"


type Props = {
    isMobileOpen: boolean
    onToggleMobile: () => void
}

export const Header = ({ isMobileOpen, onToggleMobile }: Props) => (
    <header className="flex h-14 items-center justify-between border-b border-black/10 bg-background px-4 md:px-6">
        <div className="flex items-center gap-3">

            {/* menu icon btn */}
            {
                !isMobileOpen && (
                    <button
                        type="button"

                        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-600 hover:bg-surface-low md:hidden"
                        onClick={onToggleMobile}
                    >

                        <MenuIcon />
                    </button>
                )
            }
            <Logo />
        </div>

        <div className="flex items-center gap-2">
            <div className="hidden text-right leading-tight md:block">
                <p className="text-[11px] font-semibold text-slate-900">Mahmoud Taha</p>
                <p className="text-[9px] font-semibold uppercase tracking-[0.08em] text-slate-400">Project Manager</p>
            </div>
            <div className="grid h-7 w-7 place-items-center rounded-md bg-primary text-[10px] font-semibold text-white">
                MT
            </div>
        </div>
    </header>
)