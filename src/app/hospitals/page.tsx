import DownloadApp from '@/components/DownloadApp'
import FindHospitals from '@/components/FindHospitals'
import Reviews from '@/components/Reviews'
import React from 'react'

const Hospitals = () => {
  return (
     <div className='mt-20'>
            <FindHospitals itemsPerPage={10} useApiData={true} useDistricts={true} />
            <Reviews />
            <DownloadApp />
        </div>
  )
}

export default Hospitals