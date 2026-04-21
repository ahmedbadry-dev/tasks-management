
import { MemberIdentity } from './MemberIdentity'
import { RoleBadge } from './RoleBadge'
import { JoinDate } from './JoinDate'
import { MemberActionsMenu } from './MemberActionsMenu'
import { cn } from '@/utils/cn';

type MemberRowProps = {
    member?: string;
    className?: string;
};

export const MemberRow = ({ className }: MemberRowProps) => {
    return (
        <div className={cn('grid grid-cols-[2fr_1fr_1fr_60px] py-5 px-8 bg-white  border-b border-b-slate-200/30', className)}>
            <MemberIdentity />
            <RoleBadge />
            <JoinDate />
            <MemberActionsMenu />
        </div>
    )
}
