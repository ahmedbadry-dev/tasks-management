
import { cn } from '@/utils/cn'
import { MemberRow } from './MemberRow'
import { MembersTableHeader } from './MembersTableHeader'

export const MembersDesktopTable = () => {
    const test = [...Array(4)]

    const members = test.map((_, idx) => {
        const isLastItem = idx === test.length - 1;
        return (
            <MemberRow key={idx}
                className={cn(
                    "border-b border-surface-highest/50",
                    isLastItem && "border-b-0 rounded-b-lg"
                )} />
        )
    })

    return (
        <div className='flex flex-1 flex-col shadow-[0px 1px 2px 0px #0000000D] border-3 border-surface-highest/50 rounded-lg'>
            <MembersTableHeader />
            {members}
        </div>
    )
}
