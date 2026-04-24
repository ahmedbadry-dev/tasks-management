
import { MemberIdentity } from './MemberIdentity'
import { RoleBadge } from './RoleBadge'
import { MemberActionsMenu } from './MemberActionsMenu'
import { TProjectMember } from '../types'

type MemberCardProps = {
    member: TProjectMember
}

export const MemberCard = ({ member }: MemberCardProps) => {
    const { role, metadata: { name, email } } = member

    return (
        <div className='flex  justify-between bg-white p-4 rounded-lg'>
            <MemberIdentity metaData={{ name, email }} />
            <div className='flex flex-col justify-between'>
                <RoleBadge role={role} />
                <MemberActionsMenu />
            </div>
        </div>
    )
}
