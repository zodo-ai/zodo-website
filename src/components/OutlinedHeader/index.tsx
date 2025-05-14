import React from 'react'
import { PillTagPropsI } from './types'
import Thunder from "~/svg/thunder.svg"
import Image from 'next/image'
import { twMerge } from 'tailwind-merge'

const OutlinedHeader = ({ icon, text, borderColor, paddingY, paddingX, textColor }: PillTagPropsI) => {
    return (
        <div className={twMerge("inline-flex items-center gap-2 border rounded-full", borderColor ?? "border-[#F0F4F7]", paddingY ?? 'py-2', paddingX ?? 'px-4', textColor ?? "")}>
            <Image src={icon ?? Thunder} alt='icon' className='h-5 w-5' />
            <span className="text-[#1e4444] font-semibold text-sm">
                {text}
            </span>
        </div>)
}

export default OutlinedHeader