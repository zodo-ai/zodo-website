'use client'
import React from 'react'
import OutlinedHeader from '../OutlinedHeader'
import CustomHead from '../CustomHead'
import CustomSearch from '../CustomSearch'
import Lister from '../Lister'
import DoctorCard from '../DoctorCard'
import SearchFilters from '../SearchFilters'
import { doctorFilters } from '@/dummy/filters'
import { doctors } from '@/dummy/doctors'
import { useRouter } from 'next/navigation'

const FindDoctors = ({ showFilters = false, itemsPerPage }: { showFilters?: boolean; itemsPerPage?: number }) => {
    const router = useRouter()
    return (
        <div className='flex flex-col justify-center items-center gap-4'>
            <div>
                <OutlinedHeader text='EASY AND FAST BOOKING' />
            </div>
            <CustomHead text='Find For Doctors' highlight='Doctors' />
            <div className='mb-10 flex justify-center w-full items-center'>
                <CustomSearch
                    locations={['Bangalore', 'Chennai', 'Delhi']}
                    onLocationChange={(loc) => console.log('Selected:', loc)}
                    onSearchChange={(q) => console.log('Search Query:', q)}
                />
            </div>

            {showFilters && <div><SearchFilters filters={doctorFilters} /></div>}

            <section className="max-w-7xl mx-auto px-4 mb-20">
                <Lister
                    items={doctors}
                    itemsPerPage={itemsPerPage}
                    renderItem={(doctor) => (
                        <DoctorCard
                            name={doctor.name}
                            specialty={doctor.specialty}
                            image={doctor.image}
                            onBook={() => router.push(`/doctors/${doctor.name}`)}
                        />
                    )}
                />
            </section>
        </div>
    )
}

export default FindDoctors