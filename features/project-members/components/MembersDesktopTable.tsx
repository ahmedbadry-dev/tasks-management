
import { cn } from '@/utils/cn'
import { MemberRow } from './MemberRow'
import { MembersTableHeader } from './MembersTableHeader'
import { TProjectMember } from '../types'

type MembersDesktopTableProps = {
    data: { success: true, data: TProjectMember[] }
}
export const MembersDesktopTable = ({ data: { data, success } }: MembersDesktopTableProps) => {

    if (!success) return <p>error</p>

    const members = data.map((member, idx) => {
        const isLastItem = idx === data.length - 1;
        return (
            <MemberRow
                key={member.member_id}
                member={member}
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
