'use client'
import CustomHead from "@/components/CustomHead";
import CustomSearch from "@/components/CustomSearch";
import DoctorCard from "@/components/DoctorCard";
import DoctorDetails from "@/components/DoctorDetails";
import DownloadApp from "@/components/DownloadApp";
import Lister from "@/components/Lister";
import SearchFilters from "@/components/SearchFilters";
import { hospitalDoctorFilters } from "@/dummy/filters";
import { useRouter } from "next/navigation";
import useDoctorListing from "@/hooks/doctors/use-hook";
import useDistrictsHook from "@/hooks/districts/use-hook";
import { DoctorI } from "@/network/doctors/types";

const DoctorDetailed = () => {
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
        initialLimit: 12,
        autoFetch: true
    });

    const { districts } = useDistrictsHook();

    const handleLocationChange = (location: string, _districtId?: string) => {
        filterByCity(location);
    };

    const handleSearchChange = (query: string) => {
        search(query);
    };
    return (
        <div>
            <div className="flex flex-col items-center justify-center">
                <div className="space-y-10 mt-20">
                    <CustomHead text='Find Your Doctor' highlight='Doctor' />
                    <div>
                        <DoctorDetails />
                    </div>
                    <div className="flex flex-col items-center justify-center gap-10 mb-10">
                        <CustomSearch
                            locations={districts}
                            onLocationChange={handleLocationChange}
                            onSearchChange={handleSearchChange}
                            useDistricts={true}
                        />
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

export default DoctorDetailed;