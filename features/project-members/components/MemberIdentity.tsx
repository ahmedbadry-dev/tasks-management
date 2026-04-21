import React from 'react'
import { MemberAvatar } from './MemberAvatar'
import { MemberInfo } from './MemberInfo'

export const MemberIdentity = () => {
    return (
        <div className='min-w-0 overflow-hidden flex gap-4.5 items-center'>
            <MemberAvatar />
            <MemberInfo />
        </div>
    )
}
