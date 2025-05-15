import React from 'react'
import OutlinedHeader from '../OutlinedHeader'
import { Button } from '../ui/button'
import FeatureGrid from '../FeatureGrid'

const Services = () => {
    return (
        <div className='flex flex-col gap-4 w-full px-[4%] lg:px-[9%]'>
            <div className='hidden lg:flex'>
                <OutlinedHeader text='BUILT IT FOR USERS' />
            </div>
            <div className='flex-col lg:flex-row text-center lg:text-start justify-between mb-8'>
                <h1 className='text-[#004746] font-medium text-4xl lg:text-6xl mb-4 lg:mb-0'>Key Features</h1>
                <div className='space-y-6'>
                    <h4 className='text-[#727272] leading-6'>Book Hospital Appointments in Just 2 <br /> Minutes.</h4>
                    <Button className='rounded-full font-medium text-base border border-[#004746] px-5 py-5' variant={'outline'}>Book Appointment Now</Button>
                </div>
            </div>
            <FeatureGrid />
        </div>
    )
}

export default Services