import React from 'react'
import InfoCardPair from '../InfoCardPair'
import HospitalOne from "~/png/HospitalOne.png"
import { DoctorI } from '@/network/doctors/types'

interface DoctorDetailsProps {
    doctor?: DoctorI | null;
    loading?: boolean;
}

const DoctorDetails = ({ doctor, loading }: DoctorDetailsProps) => {
    if (loading) {
        return (
            <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1B7C7B]"></div>
            </div>
        );
    }

    return (
        <div>
            <InfoCardPair
                leftCard={{
                    imageSrc: doctor?.profile_pic && doctor.profile_pic.trim() !== '' ? doctor.profile_pic : HospitalOne,
                    title: doctor?.name || 'Dr. Shomolu Bariga',
                    subtitle: 'Doctor', // Could be enhanced with specialty field if available
                    rating: { value: 4.9, count: 623 }, // Default values since not in API
                    location: doctor?.city ? `${doctor.city} • Experience` : '100 Patients 12 year exp',
                    phone: doctor?.phone_number || '',
                    tag: doctor?.hospital_id ? 'Hospital Doctor' : 'Independent Practice',
                }}
                rightCard={{
                    heading: 'About Me',
                    description: doctor?.name ?
                        `${doctor.name} is a dedicated medical professional providing quality healthcare services. ${doctor.city ? `Based in ${doctor.city}, ` : ''}committed to patient care and medical excellence.` :
                        `Dr. Shomolu Bariga is a Dentist from Osun State. He practices at General Hospital and is committed to providing excellent patient care.`,
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
