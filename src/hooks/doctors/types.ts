import { DoctorI } from "@/network/doctors/types";

export interface UseDoctorListingReturnI {
    doctors: DoctorI[];
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
    filterByCity: (city: string) => void;
    filterByHospital: (hospitalId: string) => void;
    clearFilters: () => void;
}

export interface UseDoctorListingOptionsI {
    initialLimit?: number;
    autoFetch?: boolean;
}
