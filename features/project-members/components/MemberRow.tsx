
import { MemberIdentity } from './MemberIdentity'
import { RoleBadge } from './RoleBadge'
import { JoinDate } from './JoinDate'
import { MemberActionsMenu } from './MemberActionsMenu'
import { cn } from '@/utils/cn';
import { TProjectMember } from '../types';

type MemberRowProps = {
    member: TProjectMember;
    className?: string;
};

export const MemberRow = ({ member, className }: MemberRowProps) => {
    const { role, metadata: { name, email } } = member
    return (
        <div className={cn('grid grid-cols-[2fr_1fr_1fr_60px] py-5 px-8 bg-white  border-b border-b-slate-200/30', className)}>
            <MemberIdentity metaData={{ name, email }} />
            <RoleBadge role={role} />
            <JoinDate />
            <MemberActionsMenu />
        </div>
    )
}
