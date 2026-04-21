import React from 'react'
import { MemberAvatar } from './MemberAvatar'
import { MemberInfo } from './MemberInfo'

type MemberIdentityProps = {
    metaData: {
        name: string;
        email: string;
    }
}
export const MemberIdentity = ({
    metaData: { email, name },
}: MemberIdentityProps) => {
    return (
        <div className='min-w-0 overflow-hidden flex gap-4.5 items-center'>
            <MemberAvatar name={name} />
            <MemberInfo name={name} email={email} />
        </div>
    )
}
