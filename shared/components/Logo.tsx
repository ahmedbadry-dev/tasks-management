import React from 'react'
import { SecurityHexIcon } from './icons'

export const Logo = () => {
    return (
        <div className='flex justify-center items-center gap-2'>
            <span>
                <SecurityHexIcon className="text-primary-container" />
            </span>
            <p className='text-slate-900 font-bold text-[20px] leading-7 tracking-[-0.5px] align-middle'>TASKLY</p>
        </div>
    )
}
