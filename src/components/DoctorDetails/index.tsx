import React from 'react'
import InfoCardPair from '../InfoCardPair'
import HospitalOne from "~/png/HospitalOne.png"

const DoctorDetails = () => {
    return (
        <div>
            <InfoCardPair
                leftCard={{
                    imageSrc: HospitalOne,
                    title: 'Dr. Shomolu Bariga',
                    subtitle: 'Dentist',
                    rating: { value: 4.9, count: 623 },
                    location: '100 Patients 12 year exp',
                    phone: '+0479 232344233',
                    tag: 'Apollo Hospital',
                }}
                rightCard={{
                    heading: 'About Me',
                    description: `Dr. Shomolu Bariga is a Dentist from Osun State. 
He practices at General Hospital
He practices at General HospitalHe practices at General HospitalHe practices at General HospitalHe practices at General HospitalHe practices at General HospitalHe practices at General HospitalHe practices at General Hospital.`,
                }}
            />

            <div className='grid grid-cols-[3fr_2fr] gap-4 rounded-2xl'>
                <div className='space-y-4 rounded-2xl border border-[#E4E4E4] px-4 py-6 gap-6 bg-[#FAFAFA]'>
                    <h3 className='text-[#03182C] font-semibold text-xl '>Time Slot Available</h3>
                    <div className='bg-[#EAF7FF] rounded-xl  h-64'>

                    </div>
                </div>
                <div className='space-y-4 rounded-2xl border border-[#E4E4E4] px-4 py-6 gap-6 bg-[#FAFAFA]'>
                    <h3 className='text-[#03182C] font-semibold text-xl '>Reviews</h3>
                    <div className='bg-[#EAF7FF] rounded-xl  h-64'>

                    </div>
                </div>

            </div>
        </div>

    )
}

export default DoctorDetails
