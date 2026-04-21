import React from 'react'
import { MemberCard } from './MemberCard'

export const MembersMobileList = () => {

    const test = [...Array(4)]

    const members = test.map((_, idx) => {
        const isLastItem = idx === test.length - 1;
        return (
            <MemberCard key={idx}
            // className={cn(
            //     "border-b border-surface-highest/50",
            //     isLastItem && "border-b-0 rounded-b-lg"
            // )} 
            />
        )
    })
    return (
        <div className='flex flex-1 flex-col gap-3'>
            {members}
        </div>
    )
}
