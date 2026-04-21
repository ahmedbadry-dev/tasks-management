
type MemberInfoProps = {
    name: string
    email: string
}
export const MemberInfo = ({ name, email }: MemberInfoProps) => {
    return (
        <div className='min-w-0  flex-1'>
            <h3 className='text-xs md:heading-4 font-semibold'>{name}</h3>
            <p className=' text-[10px] type-body-md md:text-xs truncate'>{email}</p>
        </div>
    )
}
