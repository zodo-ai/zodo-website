'use client'
import React from 'react';
import CustomHead from "@/components/CustomHead";

import DoctorCard from "@/components/DoctorCard";
import DoctorDetails from "@/components/DoctorDetails";
import DownloadApp from "@/components/DownloadApp";
import Lister from "@/components/Lister";

import { useRouter, useParams } from "next/navigation";
import useDoctorListing from "@/hooks/doctors/use-hook";
import useDoctorDetail from "@/hooks/doctors/use-detail-hook";
import { DoctorI } from "@/network/doctors/types";
import Search from "~/svg/search.svg";
import Image from 'next/image';
import { Input } from '@/components/ui/input';

const DoctorDetailed = () => {
    const router = useRouter()
    const params = useParams()
    const doctorSlug = params.slug as string

    // Use the doctor detail hook to get doctor information
    const {
        doctor,
        loading: doctorLoading,
        error: doctorError
    } = useDoctorDetail(doctorSlug);

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
        initialLimit: 12,
        autoFetch: true
    });



    const handleSearchChange = (query: string) => {
        search(query);
    };
    return (
        <div>
            <div className="flex flex-col items-center justify-center">
                <div className="space-y-10 mt-20">
                    <CustomHead text='Find Your Doctor' highlight='Doctor' />
                    <div>
                        <DoctorDetails doctor={doctor} loading={doctorLoading} />
                        {doctorError && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                                <p>Error loading doctor details: {doctorError}</p>
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col items-center justify-center gap-10 mb-10">
                        <div className="flex w-full max-w-3xl rounded-full border shadow-xs overflow-hidden">
                            <div className="flex items-center px-4 py-3 flex-grow text-gray-500">
                                <Image src={Search} alt='Search' className='w-6 h-6 mr-2' />
                                <Input
                                    type="text"
                                    placeholder="Search related doctors"
                                    className="border-none p-0 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none text-sm placeholder:text-gray-400"
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSearchChange(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Error state */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 max-w-7xl mx-auto">
                    <p>Error loading doctors: {error}</p>
                </div>
            )}

            <section className="max-w-7xl mx-auto px-4 mb-10">
                <Lister<DoctorI>
                    items={apiDoctors}
                    itemsPerPage={12}
                    hasMore={hasMore}
                    loading={loading}
                    loadingMore={loadingMore}
                    onLoadMore={loadMore}
                    useLegacyPagination={false}
                    noResultsTitle="No related doctors found"
                    noResultsDescription="We couldn't find any doctors matching your search criteria. Try adjusting your search terms."
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
            </section>
            <DownloadApp />
        </div>
    )
}

export default DoctorDetailed;