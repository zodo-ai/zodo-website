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
import useHospitalListing from '@/hooks/hospitals/use-hook'
import { HospitalsI } from '@/network/hospitals/types'

interface FindHospitalsProps {
    itemsPerPage?: number;
    useApiData?: boolean; // Flag to switch between API and dummy data
}

const FindHospitals = ({ itemsPerPage = 10, useApiData = true }: FindHospitalsProps) => {
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
        error
    } = useHospitalListing({
        initialLimit: itemsPerPage,
        autoFetch: useApiData
    });

    const handleLocationChange = (location: string) => {
        if (useApiData) {
            filterByLocation(location);
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
                    locations={locations}
                    onLocationChange={handleLocationChange}
                    onSearchChange={handleSearchChange}
                />
            </div>

            <SearchFilters
                filters={filters}
                onChange={(value) => console.log('Selected:', value)}
            />

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
                        renderItem={(hospital) => (
                            <HospitalCard
                                hospital={hospital}
                                onBook={() => router.push(`/hospitals/${hospital.id}`)}
                            />
                        )}
                    />
                ) : (
                    <Lister
                        items={hospitals}
                        itemsPerPage={itemsPerPage}
                        useLegacyPagination={true}
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