'use client'
import React from 'react';
import CustomHead from "@/components/CustomHead";
import { Input } from "@/components/ui/input";
import DoctorCard from "@/components/DoctorCard";
import DownloadApp from "@/components/DownloadApp";
import HospitalDetails from "@/components/HospitalDetails";
import Lister from "@/components/Lister";

import { useRouter, useParams } from "next/navigation";
import useDoctorListing from "@/hooks/doctors/use-hook";
import useHospitalDetail from "@/hooks/hospitals/use-detail-hook";
import { DoctorI } from "@/network/doctors/types";
import Search from "~/svg/search.svg";
import Image from 'next/image';

const HospitalDetailed = () => {
    const router = useRouter()
    const params = useParams()
    const hospitalId = params.id as string

    const {
        hospital,
        loading: hospitalLoading,
        error: hospitalError
    } = useHospitalDetail(hospitalId);

    const {
        doctors: apiDoctors,
        loading,
        loadingMore,
        hasMore,
        loadMore,
        search,
        filterByHospital,
        error
    } = useDoctorListing({
        initialLimit: 12,
        autoFetch: false 
    });

    React.useEffect(() => {
        if (hospitalId) {
            filterByHospital(hospitalId);
        }
    }, [hospitalId, filterByHospital]);

    const handleSearchChange = (query: string) => {
        search(query);
    };

    return (
        <div>
            <div className="flex flex-col items-center justify-center">
                <div className="space-y-10 mt-20">
                    <CustomHead text='Find Your Hospital' highlight='Hospital' />
                    <HospitalDetails hospital={hospital} loading={hospitalLoading} />
                    {hospitalError && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                            <p>Error loading hospital details: {hospitalError}</p>
                        </div>
                    )}
                    <h4 className="text-[#004746] font-medium text-4xl text-center">
                        Doctors From {hospital?.name || 'This Hospital'}
                    </h4>
                    <div className="flex flex-col items-center justify-center gap-10 mb-10">
                        <div className="flex w-full max-w-3xl rounded-full border shadow-xs overflow-hidden">
                            <div className="flex items-center px-4 py-3 flex-grow text-gray-500">
                                <Image src={Search} alt='Search' className='w-6 h-6 mr-2' />
                                <Input
                                    type="text"
                                    placeholder="Search doctors in this hospital"
                                    className="border-none p-0 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none text-sm placeholder:text-gray-400"
                                    onChange={(e) => handleSearchChange(e.target.value)}
                                />
                            </div>
                        </div>
                        {/* <SearchFilters filters={hospitalDoctorFilters} /> */}
                    </div>
                </div>

            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 max-w-7xl mx-auto">
                    <p>Error loading doctors: {error}</p>
                </div>
            )}
            <section className="max-w-7xl mx-auto px-10 mb-10">
                <Lister<DoctorI>
                    items={apiDoctors}
                    itemsPerPage={12}
                    hasMore={hasMore}
                    loading={loading}
                    loadingMore={loadingMore}
                    onLoadMore={loadMore}
                    useLegacyPagination={false}
                    noResultsTitle="No doctors found in this hospital"
                    noResultsDescription="This hospital doesn't have any doctors available at the moment, or they don't match your search criteria."
                    noResultsIcon={
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    }
                    renderItem={(doctor) => (
                        <DoctorCard
                            doctor={doctor}
                            onBook={() => router.push(`/doctors/${doctor.id}`)}
                        />
                    )}
                />
            </section>
            <DownloadApp />
        </div>
    )
}

export default HospitalDetailed;