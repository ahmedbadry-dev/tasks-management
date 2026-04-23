import { getInitials } from '@/utils/getInitials'
import React from 'react'

type MemberAvatarProps = {
    name: string
    size?: number
}

export const MemberAvatar = ({ name, size = 11 }: MemberAvatarProps) => {
    return (
        <div className={`w-${size} h-${size} flex justify-center items-center type-title-md text-[14px] rounded-xl bg-surface-highest`}>
            {getInitials(name)}
        </div>
    )
}
