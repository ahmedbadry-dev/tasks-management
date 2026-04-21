import { cn } from "@/utils/cn"

type RoleBadgeProps = {
    role: string
}
export const RoleBadge = ({ role }: RoleBadgeProps) => {
    return (
        <div className='flex items-center'>
            <span className={cn('uppercase px-1 py-0.5 text-[8px] rounded-xs md:type-label-md md:text-[10px] md:px-4 md:py-2 md:rounded-xl',
                role === 'owner' ? 'bg-primary text-white' : 'bg-surface-highest text-slate-400'
            )}>{role}</span>
        </div>
    )
}
