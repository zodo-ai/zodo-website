'use client'
import React from 'react'
import OutlinedHeader from '../OutlinedHeader'
import CustomHead from '../CustomHead'
import CustomSearch from '../CustomSearch'
import { locations } from '@/dummy/locations'
import { filters } from '@/dummy/filters'
import SearchFilters from '../SearchFilters'
import Lister from '../Lister'
import HospitalCard from '../HospitalCard'
import { hospitals } from '@/dummy/hospitals'
import { useRouter } from 'next/navigation'

const FindHospitals = ({ itemsPerPage }: { itemsPerPage?: number }) => {
    const router = useRouter()
    return (
        <div className='flex flex-col justify-center items-center gap-4'>
            <div>
                <OutlinedHeader text='EASY AND FAST BOOKING' />
            </div>
            <CustomHead text='Find For Hospital' highlight='Hospital' />
            <div className='mb-10 flex justify-center w-full items-center  px-6'>
                <CustomSearch
                    locations={locations}
                    onLocationChange={(loc) => console.log('Selected:', loc)}
                    onSearchChange={(q) => console.log('Search Query:', q)}
                />
            </div>


            <SearchFilters
                filters={filters}
                onChange={(value) => console.log('Selected:', value)}
            />
            <section className="max-w-7xl mx-auto px-4 mb-20">
                <Lister
                    items={hospitals}
                    itemsPerPage={itemsPerPage}
                    renderItem={(hospital) => (
                        <HospitalCard
                            name={hospital.name}
                            location='Kochi'
                            logo={hospital.logo}
                            onBook={() => router.push(`/hospitals/${hospital.name}`)}
                        />
                    )}
                />
            </section>
        </div>
    )
}

export default FindHospitals