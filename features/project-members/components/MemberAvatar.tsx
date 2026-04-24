import { getInitials } from '@/utils/getInitials'
import React from 'react'

type MemberAvatarProps = {
    name: string
    size?: number
    textSize?: number
}

export const MemberAvatar = ({ name, size = 11, textSize = 14 }: MemberAvatarProps) => {
    return (
        <div className={`w-${size} h-${size} flex justify-center items-center type-title-md text-[${textSize}px] rounded-xl bg-surface-highest`}>
            {getInitials(name)}
        </div>
    )
}
