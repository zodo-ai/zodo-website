import React from 'react'
import { PillTagPropsI } from './types'
import Thunder from "~/svg/thunder.svg"
import Image from 'next/image'

const OutlinedHeader = ({ icon, text }: PillTagPropsI) => {
    return (
        <div className="inline-flex items-center gap-2 px-4 py-2 border border-[#F0F4F7] rounded-full">
            <Image src={icon ?? Thunder} alt='icon' className='h-5 w-5'  />
            <span className="text-[#1e4444] font-semibold text-sm">
                {text}
            </span>
        </div>)
}

export default OutlinedHeader