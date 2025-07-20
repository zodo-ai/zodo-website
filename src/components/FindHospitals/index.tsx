'use client'
import React from 'react'
import OutlinedHeader from '../OutlinedHeader'
import CustomHead from '../CustomHead'
import CustomSearch from '../CustomSearch'
import { locations } from '@/dummy/locations'
import useDistrictsHook from '@/hooks/districts/use-hook'
import Lister from '../Lister'
import HospitalCard from '../HospitalCard'
import { hospitals } from '@/dummy/hospitals'
import { useRouter } from 'next/navigation'
import useHospitalListing from '@/hooks/hospitals/use-hook'
import { HospitalsI } from '@/network/hospitals/types'

interface FindHospitalsProps {
    itemsPerPage?: number;
    useApiData?: boolean; // Flag to switch between API and dummy data
    useDistricts?: boolean; // Flag to use districts API instead of dummy locations
}

const FindHospitals = ({ itemsPerPage = 10, useApiData = true, useDistricts = true }: FindHospitalsProps) => {
    const router = useRouter()


    // Use the hospital listing hook for API data
    const {
        hospitals: apiHospitals,
        loading,
        loadingMore,
        hasMore,
        loadMore,
        search,
        filterByLocation,
        filterByDistrict,
        error
    } = useHospitalListing({
        initialLimit: itemsPerPage,
        autoFetch: useApiData
    });

    // Use districts hook for location data
    const { districts } = useDistrictsHook();

    const handleLocationChange = (location: string, districtId?: string | null) => {
        if (useApiData) {
            if (useDistricts && districtId) {
                filterByDistrict(districtId);
            } else {
                filterByLocation(location);
            }
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
            <CustomHead text='Find For Hospital' highlight='Hospital' />
            <div className='mb-10 flex justify-center w-full items-center px-6'>
                <CustomSearch
                    locations={useDistricts ? districts : locations}
                    onLocationChange={handleLocationChange}
                    onSearchChange={handleSearchChange}
                    useDistricts={useDistricts}
                    placeholder='Search for hospitals'
                />
            </div>

            {/* <SearchFilters
                filters={filters}
                onChange={(value) => console.log('Selected:', value)}
            /> */}

            {/* Error state */}
            {error && useApiData && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                    <p>Error loading hospitals: {error}</p>
                </div>
            )}

            <section className="max-w-7xl mx-auto px-4 mb-20">
                {useApiData ? (
                    <Lister<HospitalsI>
                        items={apiHospitals}
                        itemsPerPage={itemsPerPage}
                        hasMore={hasMore}
                        loading={loading}
                        loadingMore={loadingMore}
                        onLoadMore={loadMore}
                        useLegacyPagination={false}
                        noResultsTitle="No hospitals found"
                        noResultsDescription="We couldn't find any hospitals matching your search criteria. Try adjusting your location or search terms."
                        noResultsIcon={
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        }
                        renderItem={(hospital) => (
                            <HospitalCard
                                hospital={hospital}
                                onBook={() => router.push(`/hospitals/${hospital.slug || hospital.id}`)}
                            />
                        )}
                    />
                ) : (
                    <Lister
                        items={hospitals}
                        itemsPerPage={itemsPerPage}
                        useLegacyPagination={true}
                        noResultsTitle="No hospitals found"
                        noResultsDescription="We couldn't find any hospitals matching your search criteria. Try adjusting your location or search terms."
                        noResultsIcon={
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        }
                        renderItem={(hospital) => (
                            <HospitalCard
                                name={hospital.name}
                                location='Kochi'
                                logo={hospital.logo}
                                onBook={() => router.push(`/hospitals/${hospital.name}`)}
                            />
                        )}
                    />
                )}
            </section>
        </div>
    )
}

export default FindHospitals