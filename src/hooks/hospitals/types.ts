import { HospitalsI } from "@/network/hospitals/types";

export type UseHospitalListingReturnI = {
    hospitals: HospitalsI[];
    loading: boolean;
    loadingMore: boolean;
    error: string | null;
    hasMore: boolean;
    currentPage: number;
    totalPages: number;
    totalItems: number;
    loadMore: () => void;
    refresh: () => void;
    search: (query: string) => void;
    filterByLocation: (location: string) => void;
    clearFilters: () => void;
}

export type UseHospitalListingOptionsI = {
    initialLimit?: number;
    autoFetch?: boolean;
}