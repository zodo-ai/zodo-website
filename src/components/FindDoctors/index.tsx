import React from 'react'
import OutlinedHeader from '../OutlinedHeader'
import CustomHead from '../CustomHead'

const FindDoctors = () => {
  return (
    <div className='flex flex-col justify-center items-center gap-4'>
        <div>
        <OutlinedHeader text='EASY AND FAST BOOKING'  />
        </div>
        <CustomHead text='Find For Doctors' highlight='Doctors' />
        
    </div>
  )
}

export default FindDoctors