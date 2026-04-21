import { getInitials } from '@/utils/getInitials'
import React from 'react'

type MemberAvatarProps = {
    name: string
}

export const MemberAvatar = ({ name }: MemberAvatarProps) => {
    return (
        <div className='w-11 h-11 flex justify-center items-center type-title-md text-[14px] rounded-xl bg-surface-highest'>
            {getInitials(name)}
        </div>
    )
}
