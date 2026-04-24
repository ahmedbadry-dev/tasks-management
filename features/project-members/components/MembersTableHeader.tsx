import React from 'react'

export const MembersTableHeader = () => {
    return (
        <div className='grid grid-cols-[2fr_1fr_1fr_60px]   py-5 px-8 bg-surface-low type-label-sm text-slate-900 rounded-t-lg'>
            <div>member</div>
            <div>role</div>
            <div>joined at</div>
            <div className='text-end'>active</div>
        </div>
    )
}
