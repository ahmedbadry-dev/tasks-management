import { AddCircleIcon } from '@/shared/components/icons'
import Link from 'next/link'


export const AddProjectCard = () => {
    return (
        <Link
            href={'project/add'}
            className='h-55 rounded-lg bg-white p-6 flex flex-col justify-center items-center cursor-pointer'
        >
            <span className='flex justify-center items-center h-12 w-12 bg-surface-low rounded-xl'><AddCircleIcon /></span>
            <span className='type-label-sm text-[14px] mt-4.5 text-slate-900'>add project</span>
        </Link>
    )
}
