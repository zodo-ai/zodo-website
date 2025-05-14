import DownloadApp from '@/components/DownloadApp';
import FindDoctors from '@/components/FindDoctors';
import Reviews from '@/components/Reviews';
import React from 'react'

const Doctors = () => {
    return (
        <div className='mt-20'>
            <FindDoctors showFilters={true} itemsPerPage={16} />
            <Reviews />
            <DownloadApp />
        </div>
    )
}

export default Doctors;