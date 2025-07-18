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
import { locations } from '@/dummy/locations'
import useDoctorListing from '@/hooks/doctors/use-hook'
import useDistrictsHook from '@/hooks/districts/use-hook'
import { DoctorI } from '@/network/doctors/types'

interface FindDoctorsProps {
    showFilters?: boolean;
    itemsPerPage?: number;
    useApiData?: boolean;
    useDistricts?: boolean;
}

const FindDoctors = ({ showFilters = false, itemsPerPage = 10, useApiData = true, useDistricts = true }: FindDoctorsProps) => {
    const router = useRouter()

    const {
        doctors: apiDoctors,
        loading,
        loadingMore,
        hasMore,
        loadMore,
        search,
        filterByCity,
        error
    } = useDoctorListing({
        initialLimit: itemsPerPage,
        autoFetch: useApiData
    });

    const { districts } = useDistrictsHook();

    const handleLocationChange = (_location: string, districtId?: string | null) => {
        if (useApiData) {
            filterByCity(String(districtId));
        }
    };

    const handleSearchChange = (query: string) => {
        if (useApiData) {
            search(query);
        }
    };
    return (
        <div className='flex flex-col justify-center items-center gap-4'>
            <div>
                <OutlinedHeader text='EASY AND FAST BOOKING' />
            </div>
            <CustomHead text='Find For Doctors' highlight='Doctors' />
            <div className='mb-10 flex justify-center w-full items-center px-6'>
                <CustomSearch
                    locations={useDistricts ? districts : locations}
                    onLocationChange={handleLocationChange}
                    onSearchChange={handleSearchChange}
                    useDistricts={useDistricts}
                    placeholder='Search for doctors'
                />
            </div>

            {showFilters && <div><SearchFilters filters={doctorFilters} /></div>}

            {error && useApiData && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                    <p>Error loading doctors: {error}</p>
                </div>
            )}

            <section className="max-w-7xl px-4 mb-20">
                {useApiData ? (
                    <Lister<DoctorI>
                        items={apiDoctors}
                        itemsPerPage={itemsPerPage}
                        hasMore={hasMore}
                        loading={loading}
                        loadingMore={loadingMore}
                        onLoadMore={loadMore}
                        useLegacyPagination={false}
                        noResultsTitle="No doctors found"
                        noResultsDescription="We couldn't find any doctors matching your search criteria. Try adjusting your location or search terms."
                        noResultsIcon={
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        }
                        renderItem={(doctor) => (
                            <DoctorCard
                                doctor={doctor}
                                onBook={() => router.push(`/doctors/${doctor.slug || doctor.id}`)}
                            />
                        )}
                    />
                ) : (
                    <Lister
                        items={doctors}
                        itemsPerPage={itemsPerPage}
                        useLegacyPagination={true}
                        noResultsTitle="No doctors found"
                        noResultsDescription="We couldn't find any doctors matching your search criteria. Try adjusting your location or search terms."
                        noResultsIcon={
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        }
                        renderItem={(doctor) => (
                            <DoctorCard
                                name={doctor.name}
                                specialty={doctor.specialty}
                                image={doctor.image}
                                onBook={() => router.push(`/doctors/${doctor.name}`)}
                            />
                        )}
                    />
                )}
            </section>
        </div>
    )
}

export default FindDoctors