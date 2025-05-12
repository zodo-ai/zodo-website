import Image from 'next/image'
import React from 'react'
import BrandOne from "~/png/BrandOne.png"
import BrandTwo from "~/png/BrandTwo.png"
import BrandThree from "~/png/BrandThree.png"
import BrandFour from "~/png/BrandFour.png"
import BrandFive from "~/png/BrandFive.png"


const brands = [BrandFive, BrandFour,  BrandThree,   BrandTwo, BrandOne ]

const TrustedBrands = () => {
    return (
        <div className='space-y-8'>
            <h2 className='text-[#004746] text-sm text-center font-semibold'>TRUSTED BY</h2>
            <div className='flex justify-center gap-12 lg:gap-16 px-4'>
                {
                    brands.map((brand, index) => {
                        return (
                            <Image alt='Brand Logo' src={brand} key={index} className='w-auto h-7 lg:h-9 object-scale-down' />
                        )
                    })
                }
            </div>

        </div>
    )
}

export default TrustedBrands