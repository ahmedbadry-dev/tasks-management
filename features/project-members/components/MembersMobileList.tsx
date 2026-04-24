import React from 'react'
import { MemberCard } from './MemberCard'
import { TProjectMember } from '../types'

type MembersMobileListProps = {
    data: { success: true, data: TProjectMember[] }
}

export const MembersMobileList = ({ data: { data, success } }: MembersMobileListProps) => {

    if (!success) return <p>error</p>

    const members = data.map((member) => {
        return (
            <MemberCard key={member.member_id} member={member} />
        )
    })
    return (
        <div className='flex flex-1 flex-col gap-3'>
            {members}
        </div>
    )
}
