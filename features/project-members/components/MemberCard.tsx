
import { MemberIdentity } from './MemberIdentity'
import { RoleBadge } from './RoleBadge'
import { MemberActionsMenu } from './MemberActionsMenu'

export const MemberCard = () => {
    return (
        <div className='flex  justify-between bg-white p-4 rounded-lg'>
            <MemberIdentity />
            <div className='flex flex-col justify-between'>
                <RoleBadge />
                <MemberActionsMenu />
            </div>
        </div>
    )
}
