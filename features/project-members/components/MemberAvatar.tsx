import { getInitials } from '@/utils/getInitials'
import React from 'react'

type MemberAvatarProps = {
    name: string
    size?: number
    textSize?: number
    avatarUrl?: string | null
}

export const MemberAvatar = ({ name, size = 11, textSize = 14, avatarUrl }: MemberAvatarProps) => {
    return (
        <div className={`w-${size} h-${size} overflow-hidden flex justify-center items-center type-title-md text-[${textSize}px] rounded-xl bg-surface-highest`}>
            {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                    src={avatarUrl}
                    alt={name}
                    className="h-full w-full object-cover"
                    loading="lazy"
                />
            ) : (
                getInitials(name)
            )}
        </div>
    )
}
