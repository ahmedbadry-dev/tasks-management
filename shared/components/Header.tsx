import { Logo } from "@/shared/components/Logo"
import { MenuIcon } from "./icons"
import { UserMetadata } from "@/features/auth/types"
import { ProfileImg } from "./profileImg"


type Props = {
    isMobileOpen: boolean
    onToggleMobile: () => void
    user_metadata: UserMetadata
}

export const Header = ({ isMobileOpen, onToggleMobile, user_metadata }: Props) => (
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
                <p className="type-body-md font-semibold text-slate-900">{user_metadata.name}</p>
                <p className="type-label-sm text-[10px] text-primary-container">{user_metadata.department}</p>
            </div>
            <ProfileImg
                name={user_metadata.name}
                rounded="rounded-md"
            />
        </div>
    </header>
)

