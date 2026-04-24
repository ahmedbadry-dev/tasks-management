'use client'

import { getInitials } from "@/utils/getInitials"
import Dropdown from "./dropdown"
import { signOutAction } from "@/features/auth/actions/signOutAction"
import { useAppDispatch } from "@/store/hooks"
import { clearUser } from "@/store/userStore/userSlice"


type profileImgProps = {
    name?: string | null,
    rounded: string
}
export const ProfileImg = ({ name, rounded }: profileImgProps) => {

    const dispatch = useAppDispatch()
    const handleLogout = async () => {
        dispatch(clearUser())
        await signOutAction()
    }

    return (
        <Dropdown
            align="right"
            trigger={<div className={`grid h-8 w-8 place-items-center rounded-md bg-primary-container text-[14px] font-semibold text-white ${rounded}`}>
                {getInitials(name)}
            </div>}
            items={[
                { label: "profile", onClick: () => null, disabled: true, dividerAfter: true },
                { label: "logout", onClick: () => void handleLogout(), danger: true },
                // we but void to casting the return type
            ]}
        />
    )
}
